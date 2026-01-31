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
        Schema::create('business_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained()->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('subscription_plans')->onDelete('cascade');
            
            // Subscription dates
            $table->timestamp('started_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            
            // Payment info
            $table->decimal('amount_paid', 10, 2)->default(0.00);
            $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])->default('pending');
            $table->string('payment_method')->nullable(); // bKash, Nagad, Card
            $table->string('transaction_id')->nullable();
            
            // Status
            $table->enum('status', ['active', 'expired', 'cancelled', 'grace'])->default('active');
            $table->boolean('auto_renew')->default(false);
            
            // Grace period (extra days after expiry)
            $table->integer('grace_days')->default(0);
            
            $table->timestamps();
            
            // Index for faster queries
            $table->index(['business_id', 'status']);
            $table->index('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_subscriptions');
    }
};
