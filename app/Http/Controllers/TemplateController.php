<?php

namespace App\Http\Controllers;

use App\Models\BusinessCategory;
use App\Models\BusinessTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TemplateController extends Controller
{
    /**
     * Display templates for admin
     */
    public function index()
    {
        $templates = BusinessTemplate::with('category:id,name,slug,icon')
            ->orderBy('category_id')
            ->get()
            ->map(function ($template) {
                return [
                    'id' => $template->id,
                    'name' => $template->name,
                    'slug' => $template->slug,
                    'thumbnail' => $template->thumbnail,
                    'description' => $template->description,
                    'is_default' => $template->is_default,
                    'is_active' => $template->is_active,
                    'category' => $template->category,
                    'config' => $template->config,
                    'businesses_count' => $template->businesses()->count(),
                ];
            });

        $categories = BusinessCategory::active()
            ->ordered()
            ->get(['id', 'name', 'slug', 'icon']);

        return Inertia::render('Admin/Templates/Index', [
            'templates' => $templates,
            'categories' => $categories,
        ]);
    }

    /**
     * Show single template for editing
     */
    public function show(BusinessTemplate $template)
    {
        $template->load('category:id,name,slug,icon');
        
        return Inertia::render('Admin/Templates/Show', [
            'template' => [
                'id' => $template->id,
                'name' => $template->name,
                'slug' => $template->slug,
                'thumbnail' => $template->thumbnail,
                'description' => $template->description,
                'is_default' => $template->is_default,
                'is_active' => $template->is_active,
                'category' => $template->category,
                'config' => $template->config,
            ],
            'available_modules' => $this->getAvailableModules(),
            'available_features' => $this->getAvailableFeatures(),
        ]);
    }

    /**
     * Update template config
     */
    public function update(Request $request, BusinessTemplate $template)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
            'config' => ['required', 'array'],
        ]);

        $template->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? $template->description,
            'is_active' => $validated['is_active'] ?? $template->is_active,
            'config' => $validated['config'],
        ]);

        return back()->with('success', 'টেমপ্লেট আপডেট হয়েছে।');
    }

    /**
     * Update template config only (AJAX)
     */
    public function updateConfig(Request $request, BusinessTemplate $template)
    {
        $validated = $request->validate([
            'config' => ['required', 'array'],
        ]);

        $template->update(['config' => $validated['config']]);

        return response()->json(['success' => true, 'message' => 'Config আপডেট হয়েছে।']);
    }

    /**
     * Get available modules
     */
    private function getAvailableModules(): array
    {
        return [
            ['id' => 'inventory', 'name' => 'ইনভেন্টরি', 'icon' => '📦', 'description' => 'পণ্য স্টক ম্যানেজমেন্ট'],
            ['id' => 'sales', 'name' => 'বিক্রি', 'icon' => '💰', 'description' => 'বিক্রি ও ইনভয়েস'],
            ['id' => 'purchases', 'name' => 'ক্রয়', 'icon' => '🛒', 'description' => 'পণ্য ক্রয় ম্যানেজমেন্ট'],
            ['id' => 'credit', 'name' => 'বাকি', 'icon' => '📝', 'description' => 'বাকি/ধার হিসাব'],
            ['id' => 'expenses', 'name' => 'খরচ', 'icon' => '💸', 'description' => 'দৈনিক খরচ ট্র্যাকিং'],
            ['id' => 'parties', 'name' => 'পার্টি', 'icon' => '👥', 'description' => 'ক্রেতা/বিক্রেতা ম্যানেজমেন্ট'],
            ['id' => 'reports', 'name' => 'রিপোর্ট', 'icon' => '📊', 'description' => 'বিভিন্ন রিপোর্ট ও এনালাইসিস'],
            ['id' => 'invoices', 'name' => 'ইনভয়েস', 'icon' => '🧾', 'description' => 'ইনভয়েস তৈরি ও প্রিন্ট'],
            ['id' => 'jobs', 'name' => 'জব/সার্ভিস', 'icon' => '🔧', 'description' => 'সার্ভিস জব ট্র্যাকিং'],
            ['id' => 'orders', 'name' => 'অর্ডার', 'icon' => '📋', 'description' => 'অর্ডার ম্যানেজমেন্ট'],
            ['id' => 'donations', 'name' => 'দান/চাঁদা', 'icon' => '🤲', 'description' => 'দান ও চাঁদা সংগ্রহ'],
            ['id' => 'members', 'name' => 'সদস্য', 'icon' => '👤', 'description' => 'সদস্য ম্যানেজমেন্ট'],
        ];
    }

    /**
     * Get available features
     */
    private function getAvailableFeatures(): array
    {
        return [
            ['id' => 'expiry_alert', 'name' => 'মেয়াদ সতর্কতা', 'description' => 'পণ্যের মেয়াদ শেষ হলে সতর্কতা'],
            ['id' => 'batch_tracking', 'name' => 'ব্যাচ ট্র্যাকিং', 'description' => 'পণ্যের ব্যাচ নম্বর ট্র্যাক'],
            ['id' => 'warranty_tracking', 'name' => 'ওয়ারেন্টি ট্র্যাকিং', 'description' => 'পণ্যের ওয়ারেন্টি ট্র্যাক'],
            ['id' => 'serial_number', 'name' => 'সিরিয়াল নম্বর', 'description' => 'পণ্যের সিরিয়াল নম্বর'],
            ['id' => 'size_variants', 'name' => 'সাইজ ভ্যারিয়েন্ট', 'description' => 'পণ্যের বিভিন্ন সাইজ'],
            ['id' => 'color_variants', 'name' => 'কালার ভ্যারিয়েন্ট', 'description' => 'পণ্যের বিভিন্ন রঙ'],
            ['id' => 'low_stock_alert', 'name' => 'স্টক কম সতর্কতা', 'description' => 'স্টক কম হলে সতর্কতা'],
            ['id' => 'barcode', 'name' => 'বারকোড', 'description' => 'বারকোড স্ক্যানিং'],
            ['id' => 'multi_unit', 'name' => 'মাল্টি ইউনিট', 'description' => 'একাধিক একক সাপোর্ট'],
        ];
    }

    /**
     * Preview template (for onboarding)
     */
    public function preview(BusinessTemplate $template)
    {
        return Inertia::render('Templates/Preview', [
            'template' => [
                'id' => $template->id,
                'name' => $template->name,
                'slug' => $template->slug,
                'description' => $template->description,
                'category' => $template->category,
                'config' => $template->config,
            ],
        ]);
    }
}
