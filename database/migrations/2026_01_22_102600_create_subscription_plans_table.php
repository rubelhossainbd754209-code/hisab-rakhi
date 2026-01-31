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
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Free Trial, Monthly, Yearly
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2)->default(0.00); // Price in BDT
            $table->integer('duration_days'); // 15, 30, 365
            $table->enum('billing_cycle', ['once', 'monthly', 'yearly'])->default('once');
            $table->json('features')->nullable(); // Features included in plan
            $table->json('limits')->nullable(); // Limits like max_products, max_parties
            $table->boolean('is_trial')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscription_plans');
    }
};
