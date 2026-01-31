<?php

namespace Database\Seeders;

use App\Models\BusinessCategory;
use App\Models\BusinessTemplate;
use Illuminate\Database\Seeder;

class BusinessCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'মুদি দোকান',
                'slug' => 'grocery',
                'icon' => '🏪',
                'description' => 'মুদি দোকান, মনিহারি, জেনারেল স্টোরের জন্য',
                'sort_order' => 1,
                'config' => [
                    'terminology' => [
                        'customer' => 'ক্রেতা',
                        'product' => 'পণ্য',
                        'sale' => 'বিক্রি',
                        'purchase' => 'ক্রয়',
                        'credit' => 'বাকি',
                    ],
                    'modules' => ['inventory', 'sales', 'purchases', 'credit', 'reports'],
                    'default_categories' => ['চাল', 'ডাল', 'তেল', 'মসলা', 'সাবান', 'বিস্কুট'],
                ],
                'template' => [
                    'name' => 'মুদি দোকান স্ট্যান্ডার্ড',
                    'colors' => ['primary' => '#006A4E', 'secondary' => '#F42A41', 'accent' => '#FFC107'],
                ],
            ],
            [
                'name' => 'ফার্মেসি',
                'slug' => 'pharmacy',
                'icon' => '💊',
                'description' => 'ঔষধের দোকান, ফার্মেসির জন্য',
                'sort_order' => 2,
                'config' => [
                    'terminology' => [
                        'customer' => 'রোগী/ক্রেতা',
                        'product' => 'ঔষধ',
                        'sale' => 'বিক্রি',
                        'batch' => 'ব্যাচ',
                        'expiry' => 'মেয়াদ',
                    ],
                    'modules' => ['inventory', 'sales', 'expiry_tracking', 'reports'],
                    'default_categories' => ['ট্যাবলেট', 'সিরাপ', 'ইনজেকশন', 'মলম', 'ড্রপ'],
                    'features' => ['expiry_alert', 'batch_tracking'],
                ],
                'template' => [
                    'name' => 'ফার্মেসি স্ট্যান্ডার্ড',
                    'colors' => ['primary' => '#0D9488', 'secondary' => '#DC2626', 'accent' => '#22C55E'],
                ],
            ],
            [
                'name' => 'ইলেকট্রনিক্স',
                'slug' => 'electronics',
                'icon' => '📱',
                'description' => 'মোবাইল, ইলেকট্রনিক্স, কম্পিউটার শপের জন্য',
                'sort_order' => 3,
                'config' => [
                    'terminology' => [
                        'customer' => 'ক্রেতা',
                        'product' => 'পণ্য',
                        'warranty' => 'ওয়ারেন্টি',
                        'serial' => 'সিরিয়াল',
                        'service' => 'সার্ভিসিং',
                    ],
                    'modules' => ['inventory', 'sales', 'warranty', 'service', 'reports'],
                    'default_categories' => ['মোবাইল', 'ল্যাপটপ', 'টিভি', 'ফ্রিজ', 'এসি', 'এক্সেসরিজ'],
                    'features' => ['warranty_tracking', 'serial_number', 'service_booking'],
                ],
                'template' => [
                    'name' => 'ইলেকট্রনিক্স স্ট্যান্ডার্ড',
                    'colors' => ['primary' => '#3B82F6', 'secondary' => '#8B5CF6', 'accent' => '#F59E0B'],
                ],
            ],
            [
                'name' => 'রেস্টুরেন্ট',
                'slug' => 'restaurant',
                'icon' => '🍽️',
                'description' => 'রেস্টুরেন্ট, খাবারের দোকান, ক্যাফের জন্য',
                'sort_order' => 4,
                'config' => [
                    'terminology' => [
                        'customer' => 'কাস্টমার',
                        'product' => 'আইটেম',
                        'sale' => 'অর্ডার',
                        'table' => 'টেবিল',
                    ],
                    'modules' => ['menu', 'orders', 'tables', 'kitchen', 'reports'],
                    'default_categories' => ['ভাত', 'রুটি', 'মাংস', 'মাছ', 'সবজি', 'পানীয়'],
                    'features' => ['table_management', 'kitchen_display'],
                ],
                'template' => [
                    'name' => 'রেস্টুরেন্ট স্ট্যান্ডার্ড',
                    'colors' => ['primary' => '#EA580C', 'secondary' => '#DC2626', 'accent' => '#FBBF24'],
                ],
            ],
            [
                'name' => 'সার্ভিস সেন্টার',
                'slug' => 'service',
                'icon' => '🔧',
                'description' => 'মেরামত, সার্ভিসিং, টেকনিক্যাল সেবার জন্য',
                'sort_order' => 5,
                'config' => [
                    'terminology' => [
                        'customer' => 'গ্রাহক',
                        'product' => 'সার্ভিস',
                        'order' => 'জব',
                        'labor' => 'শ্রম খরচ',
                        'parts' => 'পার্টস',
                    ],
                    'modules' => ['jobs', 'parts', 'labor', 'invoices', 'reports'],
                    'default_categories' => ['মোবাইল রিপেয়ার', 'কম্পিউটার সার্ভিস', 'ইলেকট্রিক্যাল', 'প্লাম্বিং'],
                    'features' => ['job_tracking', 'parts_inventory'],
                ],
                'template' => [
                    'name' => 'সার্ভিস সেন্টার স্ট্যান্ডার্ড',
                    'colors' => ['primary' => '#6366F1', 'secondary' => '#EC4899', 'accent' => '#10B981'],
                ],
            ],
            [
                'name' => 'মসজিদ/ধর্মীয় প্রতিষ্ঠান',
                'slug' => 'religious',
                'icon' => '🕌',
                'description' => 'মসজিদ, মন্দির, ধর্মীয় প্রতিষ্ঠানের হিসাব',
                'sort_order' => 6,
                'config' => [
                    'terminology' => [
                        'income' => 'দান/চাঁদা',
                        'expense' => 'খরচ',
                        'member' => 'সদস্য',
                        'donation' => 'দান',
                    ],
                    'modules' => ['donations', 'expenses', 'members', 'events', 'reports'],
                    'default_categories' => ['জুমার চাঁদা', 'ঈদ চাঁদা', 'সাধারণ দান', 'বিদ্যুৎ বিল', 'মেরামত'],
                    'features' => ['member_management', 'event_tracking'],
                ],
                'template' => [
                    'name' => 'ধর্মীয় প্রতিষ্ঠান স্ট্যান্ডার্ড',
                    'colors' => ['primary' => '#059669', 'secondary' => '#0891B2', 'accent' => '#D97706'],
                ],
            ],
            [
                'name' => 'পোশাক/গার্মেন্টস',
                'slug' => 'clothing',
                'icon' => '👕',
                'description' => 'কাপড়ের দোকান, বুটিক, গার্মেন্টস শপের জন্য',
                'sort_order' => 7,
                'config' => [
                    'terminology' => [
                        'customer' => 'ক্রেতা',
                        'product' => 'পোশাক',
                        'size' => 'সাইজ',
                        'color' => 'রঙ',
                    ],
                    'modules' => ['inventory', 'sales', 'variants', 'reports'],
                    'default_categories' => ['শার্ট', 'প্যান্ট', 'শাড়ি', 'থ্রি-পিস', 'পাঞ্জাবি'],
                    'features' => ['size_variants', 'color_variants'],
                ],
                'template' => [
                    'name' => 'পোশাক শপ স্ট্যান্ডার্ড',
                    'colors' => ['primary' => '#DB2777', 'secondary' => '#7C3AED', 'accent' => '#F472B6'],
                ],
            ],
            [
                'name' => 'কৃষি/খামার',
                'slug' => 'agriculture',
                'icon' => '🌾',
                'description' => 'কৃষি, মৎস্য, পোল্ট্রি খামারের জন্য',
                'sort_order' => 8,
                'config' => [
                    'terminology' => [
                        'customer' => 'ক্রেতা',
                        'product' => 'ফসল/পণ্য',
                        'harvest' => 'ফসল তোলা',
                        'season' => 'মৌসুম',
                    ],
                    'modules' => ['production', 'sales', 'expenses', 'reports'],
                    'default_categories' => ['ধান', 'শাকসবজি', 'মাছ', 'মুরগি', 'গরু'],
                    'features' => ['season_tracking', 'production_log'],
                ],
                'template' => [
                    'name' => 'কৃষি/খামার স্ট্যান্ডার্ড',
                    'colors' => ['primary' => '#65A30D', 'secondary' => '#CA8A04', 'accent' => '#22C55E'],
                ],
            ],
            [
                'name' => 'পরিবহন',
                'slug' => 'transport',
                'icon' => '🚗',
                'description' => 'গাড়ি ভাড়া, পরিবহন ব্যবসার জন্য',
                'sort_order' => 9,
                'config' => [
                    'terminology' => [
                        'customer' => 'যাত্রী/ক্লায়েন্ট',
                        'trip' => 'ট্রিপ',
                        'fuel' => 'জ্বালানি',
                        'vehicle' => 'গাড়ি',
                    ],
                    'modules' => ['trips', 'fuel', 'maintenance', 'drivers', 'reports'],
                    'default_categories' => ['লোকাল ট্রিপ', 'আউটসাইড ট্রিপ', 'জ্বালানি', 'মেরামত'],
                    'features' => ['trip_tracking', 'fuel_log', 'driver_management'],
                ],
                'template' => [
                    'name' => 'পরিবহন স্ট্যান্ডার্ড',
                    'colors' => ['primary' => '#0284C7', 'secondary' => '#0891B2', 'accent' => '#F59E0B'],
                ],
            ],
            [
                'name' => 'সাধারণ ব্যবসা',
                'slug' => 'general',
                'icon' => '📊',
                'description' => 'যেকোনো ধরনের সাধারণ হিসাব নিকাশের জন্য',
                'sort_order' => 10,
                'config' => [
                    'terminology' => [
                        'customer' => 'পার্টি',
                        'product' => 'আইটেম',
                        'income' => 'আয়',
                        'expense' => 'ব্যয়',
                    ],
                    'modules' => ['transactions', 'parties', 'reports'],
                    'default_categories' => ['বিক্রি', 'ক্রয়', 'খরচ', 'বেতন'],
                ],
                'template' => [
                    'name' => 'সাধারণ হিসাব',
                    'colors' => ['primary' => '#006A4E', 'secondary' => '#F42A41', 'accent' => '#FFC107'],
                ],
            ],
        ];

        foreach ($categories as $categoryData) {
            $templateData = $categoryData['template'];
            unset($categoryData['template']);

            // Create category
            $category = BusinessCategory::create($categoryData);

            // Create default template for this category
            BusinessTemplate::create([
                'category_id' => $category->id,
                'name' => $templateData['name'],
                'slug' => $categoryData['slug'] . '-default',
                'description' => $categoryData['description'],
                'config' => [
                    'colors' => $templateData['colors'],
                    'terminology' => $categoryData['config']['terminology'] ?? [],
                    'modules' => $categoryData['config']['modules'] ?? [],
                    'default_categories' => $categoryData['config']['default_categories'] ?? [],
                    'features' => $categoryData['config']['features'] ?? [],
                ],
                'is_default' => true,
                'is_active' => true,
            ]);
        }
    }
}
