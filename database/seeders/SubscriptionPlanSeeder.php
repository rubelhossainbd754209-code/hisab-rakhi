<?php

namespace Database\Seeders;

use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;

class SubscriptionPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'ফ্রি ট্রায়াল',
                'slug' => 'free-trial',
                'description' => '১৫ দিনের বিনামূল্যে ট্রায়াল। সব ফিচার ব্যবহার করে দেখুন।',
                'price' => 0.00,
                'duration_days' => 15,
                'billing_cycle' => 'once',
                'features' => [
                    'inventory',
                    'sales',
                    'purchases', 
                    'credit',
                    'expenses',
                    'parties',
                    'reports',
                    'invoices',
                ],
                'limits' => [
                    'max_products' => 50,
                    'max_parties' => 20,
                    'max_transactions_per_day' => 30,
                ],
                'is_trial' => true,
                'is_popular' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'মাসিক',
                'slug' => 'monthly',
                'description' => 'প্রতি মাসে পেমেন্ট করুন। যেকোনো সময় বাতিল করতে পারবেন।',
                'price' => 299.00,
                'duration_days' => 30,
                'billing_cycle' => 'monthly',
                'features' => [
                    'inventory',
                    'sales',
                    'purchases',
                    'credit',
                    'expenses',
                    'parties',
                    'reports',
                    'invoices',
                    'barcode',
                    'multi_unit',
                ],
                'limits' => [
                    'max_products' => 500,
                    'max_parties' => 200,
                    'max_transactions_per_day' => 'unlimited',
                ],
                'is_trial' => false,
                'is_popular' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'বাৎসরিক',
                'slug' => 'yearly',
                'description' => 'বছরে একবার পেমেন্ট করুন এবং ২ মাস বিনামূল্যে পান!',
                'price' => 2499.00,
                'duration_days' => 365,
                'billing_cycle' => 'yearly',
                'features' => [
                    'inventory',
                    'sales',
                    'purchases',
                    'credit',
                    'expenses',
                    'parties',
                    'reports',
                    'invoices',
                    'barcode',
                    'multi_unit',
                    'priority_support',
                    'data_backup',
                ],
                'limits' => [
                    'max_products' => 'unlimited',
                    'max_parties' => 'unlimited',
                    'max_transactions_per_day' => 'unlimited',
                ],
                'is_trial' => false,
                'is_popular' => false,
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan
            );
        }

        $this->command->info('Subscription plans seeded successfully!');
    }
}
