<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Transaction;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TransactionController extends Controller
{
    /**
     * Display a listing of transactions including invoice data.
     */
    public function index(Request $request)
    {
        $business = Business::where('user_id', auth()->id())->firstOrFail();
        
        // Get date filter
        $dateFilter = $request->get('filter', 'today');
        $startDate = match($dateFilter) {
            'today' => Carbon::today(),
            'week' => Carbon::now()->startOfWeek(),
            'month' => Carbon::now()->startOfMonth(),
            'year' => Carbon::now()->startOfYear(),
            default => Carbon::today(),
        };
        $endDate = Carbon::now();

        // Get manual transactions
        $transactions = Transaction::where('business_id', $business->id)
            ->with('party')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->latest('transaction_date')
            ->latest()
            ->get()
            ->map(function($t) {
                return [
                    'id' => $t->id,
                    'type' => $t->type,
                    'amount' => $t->amount,
                    'description' => $t->description,
                    'party' => $t->party,
                    'transaction_date' => $t->transaction_date,
                    'source' => 'transaction',
                ];
            });

        // Get invoices as transactions (sales)
        $invoices = Invoice::where('business_id', $business->id)
            ->with('party')
            ->whereBetween('date', [$startDate, $endDate])
            ->latest('date')
            ->get()
            ->map(function($invoice) {
                return [
                    'id' => 'inv-' . $invoice->id,
                    'type' => 'sale',
                    'amount' => $invoice->total_amount,
                    'description' => 'বিল #' . $invoice->invoice_number,
                    'party' => $invoice->party,
                    'transaction_date' => $invoice->date,
                    'source' => 'invoice',
                    'invoice_id' => $invoice->id,
                    'paid_amount' => $invoice->paid_amount,
                    'due_amount' => $invoice->due_amount,
                    'status' => $invoice->status,
                ];
            });

        // Merge and sort by date
        $allTransactions = $transactions->concat($invoices)
            ->sortByDesc('transaction_date')
            ->values();

        // Calculate summaries
        $todayIncome = $allTransactions
            ->filter(fn($t) => in_array($t['type'], ['sale', 'payment_in', 'income']))
            ->sum('amount');
        
        $todayExpense = $allTransactions
            ->filter(fn($t) => in_array($t['type'], ['expense', 'purchase', 'payment_out']))
            ->sum('amount');

        $totalDue = Invoice::where('business_id', $business->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('due_amount');

        $totalPaid = Invoice::where('business_id', $business->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('paid_amount');

        // Count invoices today
        $invoiceCount = Invoice::where('business_id', $business->id)
            ->whereDate('date', Carbon::today())
            ->count();

        return \Inertia\Inertia::render('Transactions/Index', [
            'transactions' => $allTransactions,
            'summary' => [
                'total_income' => $todayIncome,
                'total_expense' => $todayExpense,
                'net' => $todayIncome - $todayExpense,
                'total_due' => $totalDue,
                'total_paid' => $totalPaid,
                'invoice_count' => $invoiceCount,
            ],
            'filter' => $dateFilter,
        ]);
    }

    /**
     * Store a newly created transaction in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:income,expense,sale,purchase,payment_in,payment_out',
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:255',
            'party_id' => 'nullable|exists:parties,id',
            'transaction_date' => 'required|date',
        ]);

        $business = Business::where('user_id', auth()->id())->firstOrFail();

        Transaction::create([
            'business_id' => $business->id,
            'party_id' => $validated['party_id'] ?? null,
            'type' => $validated['type'],
            'amount' => $validated['amount'],
            'description' => $validated['description'],
            'transaction_date' => $validated['transaction_date'],
        ]);

        return back()->with('success', 'লেনদেন সফলভাবে যোগ হয়েছে।');
    }
}
