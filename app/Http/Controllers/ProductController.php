<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $business = auth()->user()->business;

        if (!$business) {
            return redirect()->route('onboarding');
        }

        $query = Product::where('business_id', $business->id)->latest();

        // Filtering
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->filter === 'low_stock') {
            // Using DB raw for flexibility, assuming alert_quantity is column
            $query->whereRaw('stock <= COALESCE(alert_quantity, 10)')->where('stock', '>', 0);
        } elseif ($request->filter === 'stock_out') {
            $query->where('stock', '<=', 0);
        }

        $products = $query->paginate(20)->withQueryString();
        
        // Calculate Statistics using the base query (without pagination limits, effectively)
        // Or strictly unrelated to pagination for global stats
        $allProducts = Product::where('business_id', $business->id)->get();
        
        $potentialProfit = $allProducts->sum(function($p) {
            $margin = $p->selling_price - $p->purchase_price;
            return $margin * $p->stock;
        });

        $totalStockValue = $allProducts->sum(function($p) {
            return $p->selling_price * $p->stock; // Sales value
        });
        
        $lowStockCount = $allProducts->filter(function($p) {
             return $p->stock <= ($p->alert_quantity ?: 10) && $p->stock > 0;
        })->count();

        $stockOutCount = $allProducts->where('stock', '<=', 0)->count();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'filters' => $request->all('search', 'filter'),
            'stats' => [
                'total_products' => $allProducts->count(),
                'potential_profit' => $potentialProfit, // সম্ভাব্য লাভ
                'total_stock_value' => $totalStockValue,
                'low_stock_count' => $lowStockCount,
                'stock_out_count' => $stockOutCount,
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255',
            'barcode' => 'nullable|string|max:255',
            'selling_price' => 'required|numeric|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'alert_quantity' => 'nullable|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        // Set defaults for nullable fields that can't be null in DB
        $validated['alert_quantity'] = $validated['alert_quantity'] ?? 0;
        $validated['purchase_price'] = $validated['purchase_price'] ?? 0;
        $validated['unit'] = $validated['unit'] ?? 'pcs';

        $product = new Product($validated);
        $product->business_id = auth()->user()->business->id;
        $product->save();

        return redirect()->route('products.index')->with('success', 'পণ্য সফলভাবে যুক্ত করা হয়েছে।');
    }

    public function edit(Product $product)
    {
        if ($product->business_id !== auth()->user()->business->id) {
            abort(403);
        }

        return Inertia::render('Products/Create', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        if ($product->business_id !== auth()->user()->business->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:255',
            'barcode' => 'nullable|string|max:255',
            'selling_price' => 'required|numeric|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'alert_quantity' => 'nullable|numeric|min:0',
            'unit' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $product->update($validated);

        return redirect()->route('products.index')->with('success', 'পণ্য সফলভাবে আপডেট করা হয়েছে।');
    }

    public function destroy(Product $product)
    {
        if ($product->business_id !== auth()->user()->business->id) {
            abort(403);
        }

        $product->delete();

        return redirect()->back()->with('success', 'পণ্য মুছে ফেলা হয়েছে।');
    }
}
