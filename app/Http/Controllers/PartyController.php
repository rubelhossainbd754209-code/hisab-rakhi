<?php

namespace App\Http\Controllers;

use App\Models\Party;
use App\Models\Invoice;
use App\Models\ProductReturn;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartyController extends Controller
{
    public function index(Request $request)
    {
        $business = auth()->user()->business;
        if (!$business) return redirect()->route('onboarding');

        $query = Party::where('business_id', $business->id);

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $parties = $query->latest()->paginate(30)->withQueryString();

        // Stats
        $allParties = Party::where('business_id', $business->id)->get();
        $stats = [
            'total' => $allParties->count(),
            'customers' => $allParties->where('type', 'customer')->count(),
            'suppliers' => $allParties->where('type', 'supplier')->count(),
            'total_receivable' => $allParties->where('balance', '>', 0)->sum('balance'),
            'total_payable' => abs($allParties->where('balance', '<', 0)->sum('balance')),
        ];

        return Inertia::render('Parties/Index', [
            'parties' => $parties,
            'filters' => $request->only(['type', 'search']),
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        return Inertia::render('Parties/Create');
    }

    public function store(Request $request)
    {
        $business = auth()->user()->business;
        if (!$business) abort(403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'type' => 'required|in:customer,supplier,both',
        ]);

        Party::create([
            'business_id' => $business->id,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? null,
            'type' => $validated['type'],
            'balance' => 0,
        ]);

        return redirect()->route('parties.index')->with('success', 'গ্রাহক/সাপ্লায়ার সফলভাবে যোগ করা হয়েছে।');
    }

    public function show(Party $party)
    {
        $business = auth()->user()->business;
        if (!$business) return redirect()->route('onboarding');
        
        if ((string) $party->business_id !== (string) $business->id) {
            abort(403);
        }

        // Get invoices for this party
        $invoices = Invoice::where('party_id', $party->id)
            ->latest()
            ->take(20)
            ->get();

        // Calculate statistics
        $allInvoices = Invoice::where('party_id', $party->id)->get();
        
        $stats = [
            'invoice_count' => $allInvoices->count(),
            'total_amount' => $allInvoices->sum('total_amount'),
            'total_paid' => $allInvoices->sum('paid_amount'),
            'total_due' => $allInvoices->sum('due_amount'),
            'first_purchase_date' => $allInvoices->min('date'),
            'last_purchase_date' => $allInvoices->max('date'),
            'total_returns' => ProductReturn::whereHas('invoice', function($q) use ($party) {
                $q->where('party_id', $party->id);
            })->count(),
            'return_amount' => ProductReturn::whereHas('invoice', function($q) use ($party) {
                $q->where('party_id', $party->id);
            })->sum('refund_amount'),
        ];

        return Inertia::render('Parties/Show', [
            'party' => $party,
            'invoices' => $invoices,
            'stats' => $stats,
        ]);
    }

    public function edit(Party $party)
    {
        $business = auth()->user()->business;
        if ((string) $party->business_id !== (string) $business->id) abort(403);

        return Inertia::render('Parties/Create', [
            'party' => $party,
        ]);
    }

    public function update(Request $request, Party $party)
    {
        $business = auth()->user()->business;
        if ((string) $party->business_id !== (string) $business->id) abort(403);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:500',
            'type' => 'required|in:customer,supplier,both',
        ]);

        $party->update($validated);

        return redirect()->route('parties.index')->with('success', 'গ্রাহক/সাপ্লায়ার আপডেট করা হয়েছে।');
    }

    public function destroy(Party $party)
    {
        $business = auth()->user()->business;
        if ((string) $party->business_id !== (string) $business->id) abort(403);

        $party->delete();

        return redirect()->back()->with('success', 'গ্রাহক/সাপ্লায়ার মুছে ফেলা হয়েছে।');
    }
}
