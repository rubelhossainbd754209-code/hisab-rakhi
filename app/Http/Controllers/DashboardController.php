<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Transaction;
use App\Models\Product;
use App\Models\Invoice;
use App\Models\CustomerDue;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Redirect admins to admin dashboard
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        
        // Get primary business
        $business = Business::where('user_id', $user->id)
            ->with(['template.category'])
            ->first();

        if (!$business) {
            return redirect()->route('onboarding');
        }

        // Get filter parameter
        $filter = $request->get('filter', 'today');
        
        // Calculate date range based on filter
        $dateRange = $this->getDateRange($filter);
        $startDate = $dateRange['start'];
        $endDate = $dateRange['end'];
        
        // Calculate Stats based on filter
        // Income
        $transactionIncome = Transaction::where('business_id', $business->id)
            ->whereIn('type', ['income', 'sale', 'payment_in'])
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');
        
        $invoiceIncome = Invoice::where('business_id', $business->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('paid_amount');
        
        $totalIncome = $transactionIncome + $invoiceIncome;
            
        // Expense
        $totalExpense = Transaction::where('business_id', $business->id)
            ->whereIn('type', ['expense', 'purchase', 'payment_out'])
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');
        
        // Total Due (from CustomerDue)
        $totalDue = CustomerDue::where('business_id', $business->id)
            ->whereIn('status', ['pending', 'partial'])
            ->sum('due_amount');
        
        // Total Collected (Payments received for dues in date range)
        $totalCollected = Transaction::where('business_id', $business->id)
            ->where('type', 'income')
            ->where('description', 'like', 'বাকি আদায়%')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');

        $lowStockCount = Product::where('business_id', $business->id)
            ->whereRaw('stock <= alert_quantity')
            ->count();

        $recentTransactions = Transaction::where('business_id', $business->id)
            ->with('party')
            ->latest()
            ->limit(5)
            ->get();

        $stats = [
            'total_income' => (float)$totalIncome,
            'total_expense' => (float)$totalExpense,
            'total_profit' => (float)($totalIncome - $totalExpense),
            'total_due' => (float)$totalDue,
            'total_collected' => (float)$totalCollected,
            'low_stock_count' => $lowStockCount,
            'pending_invoices' => Invoice::where('business_id', $business->id)->where('status', '!=', 'paid')->count(),
            'recent_transactions' => $recentTransactions,
            'filter' => $filter,
            'date_range' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
        ];

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'business' => $business,
            'template' => $business->template,
        ]);
    }

    /**
     * Get date range based on filter
     */
    private function getDateRange(string $filter): array
    {
        $now = Carbon::now();
        
        return match($filter) {
            'week' => [
                'start' => $now->copy()->startOfWeek(),
                'end' => $now->copy()->endOfWeek(),
            ],
            'month' => [
                'start' => $now->copy()->startOfMonth(),
                'end' => $now->copy()->endOfMonth(),
            ],
            'year' => [
                'start' => $now->copy()->startOfYear(),
                'end' => $now->copy()->endOfYear(),
            ],
            default => [ // today
                'start' => $now->copy()->startOfDay(),
                'end' => $now->copy()->endOfDay(),
            ],
        };
    }

    /**
     * Export dashboard summary as Excel/CSV
     */
    public function exportSummary(Request $request)
    {
        $user = auth()->user();
        $business = $user->business;
        
        if (!$business) {
            return back()->with('error', 'Business not found');
        }

        $filter = $request->get('filter', 'today');
        $dateRange = $this->getDateRange($filter);
        $startDate = $dateRange['start'];
        $endDate = $dateRange['end'];

        // Calculate stats
        $transactionIncome = Transaction::where('business_id', $business->id)
            ->whereIn('type', ['income', 'sale', 'payment_in'])
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');
        
        $invoiceIncome = Invoice::where('business_id', $business->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('paid_amount');
        
        $totalIncome = $transactionIncome + $invoiceIncome;
            
        $totalExpense = Transaction::where('business_id', $business->id)
            ->whereIn('type', ['expense', 'purchase', 'payment_out'])
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');
        
        $totalDue = CustomerDue::where('business_id', $business->id)
            ->whereIn('status', ['pending', 'partial'])
            ->sum('due_amount');
        
        $totalCollected = Transaction::where('business_id', $business->id)
            ->where('type', 'income')
            ->where('description', 'like', 'বাকি আদায়%')
            ->whereBetween('transaction_date', [$startDate, $endDate])
            ->sum('amount');

        // Generate CSV content
        $filterLabels = [
            'today' => 'দৈনিক',
            'week' => 'সাপ্তাহিক',
            'month' => 'মাসিক',
            'year' => 'বার্ষিক',
        ];

        $csvContent = "\xEF\xBB\xBF"; // UTF-8 BOM for Excel
        $csvContent .= "হিসাব রাখি - সারসংক্ষেপ\n";
        $csvContent .= "ব্যবসা: {$business->name}\n";
        $csvContent .= "সময়কাল: " . $filterLabels[$filter] . " ({$startDate->format('d/m/Y')} - {$endDate->format('d/m/Y')})\n";
        $csvContent .= "\n";
        $csvContent .= "বিবরণ,পরিমাণ (টাকা)\n";
        $csvContent .= "মোট বিক্রি," . number_format($totalIncome, 2) . "\n";
        $csvContent .= "মোট খরচ," . number_format($totalExpense, 2) . "\n";
        $csvContent .= "মোট বাকি," . number_format($totalDue, 2) . "\n";
        $csvContent .= "বাকি আদায়," . number_format($totalCollected, 2) . "\n";
        $csvContent .= "\n";
        $csvContent .= "নীট লাভ," . number_format($totalIncome - $totalExpense, 2) . "\n";

        $filename = "hisab-rakhi-summary-{$filter}-" . now()->format('Y-m-d') . ".csv";

        return response($csvContent)
            ->header('Content-Type', 'text/csv; charset=UTF-8')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }
}

