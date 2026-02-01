<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Party;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RecycleBinController extends Controller
{
    /**
     * Show recycle bin with all soft-deleted items
     */
    public function index()
    {
        $business = auth()->user()->business;

        if (!$business) {
            return redirect()->route('onboarding');
        }

        // Get all soft-deleted items for this business
        $deletedProducts = Product::onlyTrashed()
            ->where('business_id', $business->id)
            ->select('id', 'name', 'sku', 'selling_price', 'deleted_at')
            ->latest('deleted_at')
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'type' => 'product',
                'type_label' => 'পণ্য',
                'name' => $item->name,
                'details' => $item->sku ? "SKU: {$item->sku}" : null,
                'deleted_at' => $item->deleted_at,
                'days_remaining' => 60 - $item->deleted_at->diffInDays(now()),
            ]);

        $deletedTransactions = Transaction::onlyTrashed()
            ->where('business_id', $business->id)
            ->with('party:id,name')
            ->select('id', 'party_id', 'type', 'amount', 'description', 'deleted_at')
            ->latest('deleted_at')
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'type' => 'transaction',
                'type_label' => 'লেনদেন',
                'name' => ($item->type === 'income' ? 'আয়' : 'ব্যয়') . ': ৳' . number_format($item->amount, 0),
                'details' => $item->party?->name ?? $item->description,
                'deleted_at' => $item->deleted_at,
                'days_remaining' => 60 - $item->deleted_at->diffInDays(now()),
            ]);

        $deletedParties = Party::onlyTrashed()
            ->where('business_id', $business->id)
            ->select('id', 'name', 'phone', 'type', 'deleted_at')
            ->latest('deleted_at')
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'type' => 'party',
                'type_label' => $item->type === 'customer' ? 'কাস্টমার' : 'সাপ্লায়ার',
                'name' => $item->name,
                'details' => $item->phone,
                'deleted_at' => $item->deleted_at,
                'days_remaining' => 60 - $item->deleted_at->diffInDays(now()),
            ]);

        $deletedInvoices = Invoice::onlyTrashed()
            ->where('business_id', $business->id)
            ->with('party:id,name')
            ->select('id', 'party_id', 'invoice_number', 'total_amount', 'deleted_at')
            ->latest('deleted_at')
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'type' => 'invoice',
                'type_label' => 'ইনভয়েস',
                'name' => "#{$item->invoice_number}",
                'details' => $item->party?->name . ' - ৳' . number_format($item->total_amount, 0),
                'deleted_at' => $item->deleted_at,
                'days_remaining' => 60 - $item->deleted_at->diffInDays(now()),
            ]);

        // Merge all and sort by deleted_at
        $allItems = collect()
            ->merge($deletedProducts)
            ->merge($deletedTransactions)
            ->merge($deletedParties)
            ->merge($deletedInvoices)
            ->sortByDesc('deleted_at')
            ->values();

        return Inertia::render('Settings/RecycleBin', [
            'items' => $allItems,
            'stats' => [
                'products' => $deletedProducts->count(),
                'transactions' => $deletedTransactions->count(),
                'parties' => $deletedParties->count(),
                'invoices' => $deletedInvoices->count(),
                'total' => $allItems->count(),
            ],
        ]);
    }

    /**
     * Restore a soft-deleted item
     */
    public function restore(string $type, string $id)
    {
        $business = auth()->user()->business;

        $model = $this->getModel($type, $id, $business->id);

        if (!$model) {
            return back()->with('error', 'আইটেম পাওয়া যায়নি।');
        }

        $model->restore();

        $typeLabels = [
            'product' => 'পণ্য',
            'transaction' => 'লেনদেন',
            'party' => 'পার্টি',
            'invoice' => 'ইনভয়েস',
        ];

        return back()->with('success', "{$typeLabels[$type]} সফলভাবে পুনরুদ্ধার করা হয়েছে!");
    }

    /**
     * Permanently delete an item
     */
    public function forceDelete(string $type, string $id)
    {
        $business = auth()->user()->business;

        $model = $this->getModel($type, $id, $business->id);

        if (!$model) {
            return back()->with('error', 'আইটেম পাওয়া যায়নি।');
        }

        $model->forceDelete();

        return back()->with('success', 'স্থায়ীভাবে মুছে ফেলা হয়েছে!');
    }

    /**
     * Empty entire recycle bin
     */
    public function empty()
    {
        $business = auth()->user()->business;

        Product::onlyTrashed()->where('business_id', $business->id)->forceDelete();
        Transaction::onlyTrashed()->where('business_id', $business->id)->forceDelete();
        Party::onlyTrashed()->where('business_id', $business->id)->forceDelete();
        Invoice::onlyTrashed()->where('business_id', $business->id)->forceDelete();

        return back()->with('success', 'রিসাইকেল বিন খালি করা হয়েছে!');
    }

    /**
     * Get model instance by type and ID
     */
    private function getModel(string $type, string $id, string $businessId)
    {
        return match ($type) {
            'product' => Product::onlyTrashed()->where('business_id', $businessId)->find($id),
            'transaction' => Transaction::onlyTrashed()->where('business_id', $businessId)->find($id),
            'party' => Party::onlyTrashed()->where('business_id', $businessId)->find($id),
            'invoice' => Invoice::onlyTrashed()->where('business_id', $businessId)->find($id),
            default => null,
        };
    }
}
