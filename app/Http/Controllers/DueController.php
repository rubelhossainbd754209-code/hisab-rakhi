<?php

namespace App\Http\Controllers;

use App\Models\CustomerDue;
use App\Models\Party;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DueController extends Controller
{
    /**
     * Display dues list with customer balances
     */
    public function index(Request $request)
    {
        $business = auth()->user()->business;

        if (!$business) {
            return redirect()->route('onboarding');
        }

        // Get all customer dues grouped by party
        $dues = CustomerDue::where('business_id', $business->id)
            ->whereIn('status', ['pending', 'partial'])
            ->with('party:id,name,phone,address,balance')
            ->latest()
            ->get()
            ->map(fn($due) => [
                'id' => $due->id,
                'party' => $due->party,
                'items' => $due->items,
                'total_amount' => (float) $due->total_amount,
                'paid_amount' => (float) $due->paid_amount,
                'due_amount' => (float) $due->due_amount,
                'due_date' => $due->due_date?->format('Y-m-d'),
                'notes' => $due->notes,
                'status' => $due->status,
                'days_ago' => (int) $due->created_at->diffInDays(now()),
                'created_at' => $due->created_at->format('d M Y'),
            ]);

        // Calculate stats
        $totalDue = $dues->sum('due_amount');
        $uniqueParties = $dues->pluck('party.id')->unique()->count();

        // Get products for search
        $products = Product::where('business_id', $business->id)
            ->where('is_active', true)
            ->select('id', 'name', 'sku', 'selling_price', 'stock', 'unit')
            ->orderBy('name')
            ->get();

        // Get customers for dropdown
        $customers = Party::where('business_id', $business->id)
            ->where('type', 'customer')
            ->select('id', 'name', 'phone', 'address', 'balance')
            ->orderBy('name')
            ->get();

        return Inertia::render('Dues/Index', [
            'dues' => $dues->values(),
            'products' => $products,
            'customers' => $customers,
            'stats' => [
                'total_due' => $totalDue,
                'total_customers' => $uniqueParties,
            ],
        ]);
    }

    /**
     * Store a new due entry
     */
    public function store(Request $request)
    {
        $business = auth()->user()->business;

        $validated = $request->validate([
            'party_id' => 'nullable|uuid|exists:parties,id',
            'new_customer_name' => 'nullable|string|max:255',
            'new_customer_phone' => 'nullable|string|max:20',
            'items' => 'required|array|min:1',
            'items.*.type' => 'required|in:product,custom',
            'items.*.product_id' => 'nullable|uuid',
            'items.*.name' => 'required|string|max:255',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0.01',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string|max:500',
        ]);

        // Either party_id or new_customer_name required
        if (empty($validated['party_id']) && empty($validated['new_customer_name'])) {
            return back()->withErrors(['party_id' => 'গ্রাহক নির্বাচন করুন অথবা নতুন গ্রাহক যোগ করুন']);
        }

        // Create new customer if needed
        if (!empty($validated['new_customer_name'])) {
            $party = Party::create([
                'business_id' => $business->id,
                'type' => 'customer',
                'name' => $validated['new_customer_name'],
                'phone' => $validated['new_customer_phone'] ?? null,
                'balance' => 0,
            ]);
            $partyId = $party->id;
        } else {
            $partyId = $validated['party_id'];
            $party = Party::find($partyId);
        }

        $due = CustomerDue::create([
            'business_id' => $business->id,
            'party_id' => $partyId,
            'items' => $validated['items'],
            'total_amount' => $validated['total_amount'],
            'paid_amount' => 0,
            'due_amount' => $validated['total_amount'],
            'due_date' => $validated['due_date'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        // Update party balance (negative = due)
        $party->decrement('balance', $validated['total_amount']);

        return back()->with('success', 'বাকি সফলভাবে যোগ করা হয়েছে!');
    }

    /**
     * Collect payment for a due
     */
    public function collect(Request $request, CustomerDue $due)
    {
        $business = auth()->user()->business;

        if (!$business || $due->business_id != $business->id) {
            abort(403);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . $due->due_amount,
            'payment_method' => 'required|in:cash,bkash,nagad,rocket,bank',
            'notes' => 'nullable|string|max:255',
        ]);

        // Update due
        $due->paid_amount += $validated['amount'];
        $due->due_amount -= $validated['amount'];
        $due->status = $due->due_amount <= 0 ? 'paid' : 'partial';
        $due->save();

        // Update party balance
        $due->party->increment('balance', $validated['amount']);

        // Create transaction record
        Transaction::create([
            'business_id' => $business->id,
            'party_id' => $due->party_id,
            'type' => 'income',
            'amount' => $validated['amount'],
            'description' => 'বাকি আদায় - ' . $due->party->name,
            'transaction_date' => now(),
            'payment_method' => $validated['payment_method'],
        ]);

        return back()->with('success', '৳' . number_format($validated['amount'], 0) . ' সফলভাবে আদায় করা হয়েছে!');
    }

    /**
     * Collect payment from party balance (without CustomerDue record)
     */
    public function collectFromParty(Request $request, Party $party)
    {
        $business = auth()->user()->business;

        if (!$business || $party->business_id != $business->id) {
            abort(403);
        }

        $maxAmount = abs($party->balance);

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . $maxAmount,
            'payment_method' => 'required|in:cash,bkash,nagad,rocket,bank',
            'notes' => 'nullable|string|max:255',
        ]);

        // Update party balance
        $party->increment('balance', $validated['amount']);

        // Create transaction record
        Transaction::create([
            'business_id' => $business->id,
            'party_id' => $party->id,
            'type' => 'income',
            'amount' => $validated['amount'],
            'description' => 'বাকি আদায় - ' . $party->name,
            'transaction_date' => now(),
            'payment_method' => $validated['payment_method'],
        ]);

        return back()->with('success', '৳' . number_format($validated['amount'], 0) . ' সফলভাবে আদায় করা হয়েছে!');
    }

    /**
     * Get share message for a due
     */
    public function getShareMessage(CustomerDue $due)
    {
        $business = auth()->user()->business;

        if ($due->business_id !== $business->id) {
            abort(403);
        }

        return response()->json([
            'message' => $due->getShareMessage($business->name),
            'phone' => $due->party->phone,
        ]);
    }

    /**
     * Get share message for party balance
     */
    public function getPartyShareMessage(Party $party)
    {
        $business = auth()->user()->business;

        if ($party->business_id !== $business->id) {
            abort(403);
        }

        $message = "🏪 {$business->name}\n";
        $message .= "─────────────────────\n";
        $message .= "প্রিয় {$party->name},\n\n";
        $message .= "আপনার বাকি: ৳" . number_format(abs($party->balance), 0) . "\n\n";
        $message .= "দয়া করে বাকি পরিশোধ করুন।\nধন্যবাদ! 🙏";

        return response()->json([
            'message' => $message,
            'phone' => $party->phone,
        ]);
    }

    /**
     * Update a due record
     */
    public function update(Request $request, CustomerDue $due)
    {
        $business = auth()->user()->business;

        if ($due->business_id !== $business->id) {
            abort(403);
        }

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.type' => 'required|in:product,custom',
            'items.*.product_id' => 'nullable|uuid',
            'items.*.name' => 'required|string|max:255',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0.01',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string|max:500',
        ]);

        // Calculate difference and update party balance
        $oldDueAmount = $due->due_amount;
        $newDueAmount = $validated['total_amount'] - $due->paid_amount;
        $balanceDiff = $newDueAmount - $oldDueAmount;

        // Update due record
        $due->update([
            'items' => $validated['items'],
            'total_amount' => $validated['total_amount'],
            'due_amount' => $newDueAmount,
            'due_date' => $validated['due_date'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => $newDueAmount <= 0 ? 'paid' : ($due->paid_amount > 0 ? 'partial' : 'pending'),
        ]);

        // Update party balance
        if ($balanceDiff != 0) {
            $due->party->decrement('balance', $balanceDiff);
        }

        return back()->with('success', 'বাকি সফলভাবে আপডেট করা হয়েছে!');
    }

    /**
     * Delete a due record
     */
    public function destroy(CustomerDue $due)
    {
        $business = auth()->user()->business;

        if ($due->business_id !== $business->id) {
            abort(403);
        }

        // Restore party balance (add back the due amount)
        $due->party->increment('balance', $due->due_amount);

        // Soft delete the due
        $due->delete();

        return back()->with('success', 'বাকি সফলভাবে মুছে ফেলা হয়েছে!');
    }
}
