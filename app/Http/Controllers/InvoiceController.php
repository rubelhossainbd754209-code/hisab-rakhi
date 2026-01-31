<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Product;
use App\Models\Party;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index()
    {
        $business = auth()->user()->business;
        if (!$business) return redirect()->route('onboarding');

        $invoices = Invoice::with(['party'])
            ->where('business_id', $business->id)
            ->latest()
            ->paginate(20);

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function create()
    {
        $business = auth()->user()->business;
        if (!$business) return redirect()->route('onboarding');

        // Fetch products for the POS search
        $products = Product::where('business_id', $business->id)
            ->where('is_active', true)
            ->select('id', 'name', 'sku', 'selling_price', 'stock', 'barcode')
            ->get();

        // Fetch parties (customers) for selection
        $parties = Party::where('business_id', $business->id)
            ->whereIn('type', ['customer', 'both'])
            ->select('id', 'name', 'phone')
            ->get();

        return Inertia::render('Invoices/Create', [
            'products' => $products,
            'parties' => $parties,
        ]);
    }

    public function store(Request $request)
    {
        $business = auth()->user()->business;
        if (!$business) abort(403);

        $validated = $request->validate([
            'party_id' => 'nullable|exists:parties,id',
            'date' => 'required|date',
            'subtotal' => 'required|numeric|min:0',
            'discount' => 'numeric|min:0',
            'tax' => 'numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.total_price' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
            // New customer fields
            'new_customer_name' => 'nullable|string|max:255',
            'new_customer_phone' => 'nullable|string|max:20',
            'new_customer_address' => 'nullable|string|max:500',
        ]);

        DB::transaction(function () use ($validated, $business, $request) {
            // Handle New Customer Creation
            $partyId = $validated['party_id'] ?? null;
            
            if (empty($partyId) && !empty($validated['new_customer_name'])) {
                // Create new customer (party)
                $newParty = Party::create([
                    'business_id' => $business->id,
                    'name' => $validated['new_customer_name'],
                    'phone' => $validated['new_customer_phone'] ?? null,
                    'address' => $validated['new_customer_address'] ?? null,
                    'type' => 'customer',
                    'balance' => 0,
                ]);
                $partyId = $newParty->id;
            }

            // Generate Invoice Number
            $lastInvoice = Invoice::where('business_id', $business->id)
                ->whereYear('created_at', now()->year)
                ->latest()
                ->first();
            
            $sequence = $lastInvoice ? intval(substr($lastInvoice->invoice_number, -4)) + 1 : 1;
            $invoiceNumber = 'INV-' . now()->format('Y') . '-' . str_pad($sequence, 4, '0', STR_PAD_LEFT);

            // Create Invoice
            $invoice = Invoice::create([
                'business_id' => $business->id,
                'party_id' => $partyId,
                'invoice_number' => $invoiceNumber,
                'date' => $validated['date'],
                'subtotal' => $validated['subtotal'],
                'discount' => $validated['discount'] ?? 0,
                'tax' => $validated['tax'] ?? 0,
                'total_amount' => $validated['total_amount'],
                'paid_amount' => $validated['paid_amount'],
                'due_amount' => $validated['total_amount'] - $validated['paid_amount'],
                'status' => $validated['paid_amount'] >= $validated['total_amount'] ? 'paid' : ($validated['paid_amount'] > 0 ? 'partial' : 'unpaid'),
                'type' => 'sale',
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create Invoice Items and Update Stock
            foreach ($validated['items'] as $item) {
                // Get fresh product data for purchase price (profit calc)
                $product = Product::find($item['product_id']);
                
                $invoice->items()->create([
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'purchase_price' => $product->purchase_price,
                    'total_price' => $item['total_price'],
                    'warranty_days' => $item['warranty_days'] ?? null,
                ]);

                // Decrement Stock
                $product->decrement('stock', $item['quantity']);
            }
        });

        return redirect()->route('invoices.index')->with('success', 'ইনভয়েস সফলভাবে তৈরি হয়েছে।');
    }

    public function show(Invoice $invoice)
    {
        $business = auth()->user()->business;
        
        if (!$business) {
            return redirect()->route('onboarding');
        }
        
        // Cast both to string for comparison (handles UUID vs int mismatch)
        if ((string) $invoice->business_id !== (string) $business->id) {
            abort(403);
        }
        
        $invoice->load(['items.product', 'party', 'business']);
        
        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice
        ]);
    }
}
