<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('subscription_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, integer, boolean, json
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        $settings = [
            [
                'key' => 'trial_duration_days',
                'value' => '15',
                'type' => 'integer',
                'description' => 'ফ্রি ট্রায়ালের সময়কাল (দিন)',
            ],
            [
                'key' => 'grace_period_days',
                'value' => '3',
                'type' => 'integer',
                'description' => 'সাবস্ক্রিপশন শেষ হওয়ার পর অতিরিক্ত দিন',
            ],
            [
                'key' => 'auto_trial_on_signup',
                'value' => 'true',
                'type' => 'boolean',
                'description' => 'নতুন ব্যবসায় স্বয়ংক্রিয় ট্রায়াল',
            ],
            [
                'key' => 'show_trial_warning_days',
                'value' => '3',
                'type' => 'integer',
                'description' => 'ট্রায়াল শেষ হওয়ার কত দিন আগে সতর্কতা দেখাবে',
            ],
        ];

        foreach ($settings as $setting) {
            \DB::table('subscription_settings')->insert(array_merge($setting, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_settings');
    }
};
