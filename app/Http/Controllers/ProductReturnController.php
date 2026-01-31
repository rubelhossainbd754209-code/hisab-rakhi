<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Product;
use App\Models\ProductReturn;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ProductReturnController extends Controller
{
    public function index()
    {
        $business = auth()->user()->business;
        if (!$business) return redirect()->route('onboarding');

        $returns = ProductReturn::with(['product', 'invoice'])
            ->where('business_id', $business->id)
            ->latest()
            ->paginate(50);

        return Inertia::render('Returns/Index', [
            'returns' => $returns
        ]);
    }

    public function create()
    {
        return Inertia::render('Returns/Create');
    }

    /**
     * Search for Invoice or Product to return
     * Supports: Invoice Number, Product Code (P-XXXXX), Product Name
     */
    public function search(Request $request)
    {
        $query = $request->query('q');
        $businessId = auth()->user()->business->id;

        $invoices = collect([]);
        $products = collect([]);

        // Check if searching by Product Code (P-XXXXX format)
        if (str_starts_with(strtoupper($query), 'P-')) {
            // Extract product ID from code
            $productIdPrefix = substr($query, 2); // Remove "P-"
            
            // Find products matching this ID prefix
            $products = Product::where('business_id', $businessId)
                ->where('id', 'like', "{$productIdPrefix}%")
                ->limit(10)
                ->get();
        } else {
            // Search by Invoice Number
            $invoices = Invoice::with(['party', 'items.product'])
                ->where('business_id', $businessId)
                ->where('invoice_number', 'like', "%{$query}%")
                ->limit(5)
                ->get();

            // Also search by Product Name
            $products = Product::where('business_id', $businessId)
                ->where(function($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                      ->orWhere('sku', 'like', "%{$query}%");
                })
                ->limit(10)
                ->get();
        }

        return response()->json([
            'invoices' => $invoices,
            'products' => $products
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'nullable|exists:invoices,id', // Made optional
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0.1',
            'refund_amount' => 'required|numeric|min:0',
            'reason' => 'nullable|string',
        ]);

        $businessId = auth()->user()->business->id;

        DB::transaction(function () use ($validated, $businessId) {
            // 1. Create Return Record
            $return = new ProductReturn();
            $return->business_id = $businessId;
            $return->invoice_id = $validated['invoice_id'] ?? null; // Can be null
            $return->product_id = $validated['product_id'];
            $return->quantity = $validated['quantity'];
            $return->refund_amount = $validated['refund_amount'];
            $return->reason = $validated['reason'] ?? null;
            $return->date = now();
            // Generate simple return number
            $return->return_number = 'RET-' . strtoupper(uniqid()); 
            $return->save();

            // 2. Increase Product Stock
            $product = Product::find($validated['product_id']);
            $product->increment('stock', $validated['quantity']);
        });

        return redirect()->route('returns.index')->with('success', 'পণ্য রিটার্ন সফল হয়েছে এবং স্টক আপডেট হয়েছে।');
    }
}
