<?php

namespace App\Http\Controllers;

use App\Models\BusinessCategory;
use App\Models\BusinessTemplate;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display categories and templates for admin
     */
    public function index()
    {
        $categories = BusinessCategory::with(['templates' => function ($q) {
            $q->select('id', 'category_id', 'name', 'slug', 'thumbnail', 'is_default', 'is_active');
        }])
            ->ordered()
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'icon' => $category->icon,
                    'image' => $category->image,
                    'description' => $category->description,
                    'is_active' => $category->is_active,
                    'sort_order' => $category->sort_order,
                    'templates_count' => $category->templates->count(),
                    'templates' => $category->templates,
                ];
            });

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a new category
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:10'],
            'description' => ['nullable', 'string'],
        ], [
            'name.required' => 'ক্যাটাগরির নাম দিন।',
        ]);

        $category = BusinessCategory::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'icon' => $validated['icon'] ?? '📊',
            'description' => $validated['description'] ?? null,
            'sort_order' => BusinessCategory::max('sort_order') + 1,
            'is_active' => true,
        ]);

        // Create default template
        BusinessTemplate::create([
            'category_id' => $category->id,
            'name' => $validated['name'] . ' স্ট্যান্ডার্ড',
            'slug' => $category->slug . '-default',
            'config' => [
                'colors' => ['primary' => '#006A4E', 'secondary' => '#F42A41', 'accent' => '#FFC107'],
                'terminology' => [],
                'modules' => ['transactions', 'parties', 'reports'],
                'default_categories' => [],
            ],
            'is_default' => true,
            'is_active' => true,
        ]);

        return back()->with('success', 'ক্যাটাগরি যোগ হয়েছে।');
    }

    /**
     * Update a category
     */
    public function update(Request $request, BusinessCategory $category)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:10'],
            'description' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $category->update($validated);

        return back()->with('success', 'ক্যাটাগরি আপডেট হয়েছে।');
    }

    /**
     * Delete a category
     */
    public function destroy(BusinessCategory $category)
    {
        // Check if category has any businesses using it
        $businessCount = $category->templates()->withCount('businesses')->get()->sum('businesses_count');
        
        if ($businessCount > 0) {
            return back()->with('error', 'এই ক্যাটাগরিতে ব্যবসা আছে, মুছে ফেলা যাবে না।');
        }

        $category->delete();

        return back()->with('success', 'ক্যাটাগরি মুছে ফেলা হয়েছে।');
    }

    /**
     * Toggle category active status
     */
    public function toggleActive(BusinessCategory $category)
    {
        $category->update(['is_active' => !$category->is_active]);
        
        $status = $category->is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়';
        return back()->with('success', "ক্যাটাগরি {$status} করা হয়েছে।");
    }

    /**
     * Update sort order
     */
    public function updateOrder(Request $request)
    {
        $validated = $request->validate([
            'categories' => ['required', 'array'],
            'categories.*.id' => ['required', 'exists:business_categories,id'],
            'categories.*.sort_order' => ['required', 'integer'],
        ]);

        foreach ($validated['categories'] as $item) {
            BusinessCategory::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return back()->with('success', 'অর্ডার আপডেট হয়েছে।');
    }

    /**
     * Get categories for onboarding (public)
     */
    public function getForOnboarding()
    {
        $categories = BusinessCategory::active()
            ->ordered()
            ->with(['templates' => function ($q) {
                $q->where('is_active', true)
                    ->select('id', 'category_id', 'name', 'slug', 'thumbnail', 'description', 'config');
            }])
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                    'icon' => $category->icon,
                    'image' => $category->image,
                    'description' => $category->description,
                    'templates' => $category->templates,
                ];
            });

        return response()->json($categories);
    }
}
