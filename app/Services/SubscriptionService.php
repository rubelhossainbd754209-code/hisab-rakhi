<?php

namespace App\Services;

use App\Models\Business;
use App\Models\BusinessSubscription;
use App\Models\SubscriptionPlan;
use App\Models\SubscriptionSetting;
use Carbon\Carbon;

class SubscriptionService
{
    /**
     * Create a trial subscription for a business
     */
    public function createTrialSubscription(Business $business): BusinessSubscription
    {
        $trialPlan = SubscriptionPlan::trial()->active()->first();
        
        if (!$trialPlan) {
            throw new \Exception('No trial plan available');
        }

        $trialDuration = SubscriptionSetting::getTrialDuration();
        $gracePeriod = SubscriptionSetting::getGracePeriod();

        return BusinessSubscription::create([
            'business_id' => $business->id,
            'plan_id' => $trialPlan->id,
            'started_at' => now(),
            'expires_at' => now()->addDays($trialDuration),
            'amount_paid' => 0,
            'payment_status' => 'paid', // Trial is free
            'status' => 'active',
            'grace_days' => $gracePeriod,
        ]);
    }

    /**
     * Create a paid subscription for a business
     */
    public function createPaidSubscription(
        Business $business, 
        SubscriptionPlan $plan,
        string $paymentMethod,
        string $transactionId
    ): BusinessSubscription {
        $gracePeriod = SubscriptionSetting::getGracePeriod();

        // Cancel any existing active subscription
        $this->cancelActiveSubscription($business);

        return BusinessSubscription::create([
            'business_id' => $business->id,
            'plan_id' => $plan->id,
            'started_at' => now(),
            'expires_at' => now()->addDays($plan->duration_days),
            'amount_paid' => $plan->price,
            'payment_status' => 'paid',
            'payment_method' => $paymentMethod,
            'transaction_id' => $transactionId,
            'status' => 'active',
            'grace_days' => $gracePeriod,
        ]);
    }

    /**
     * Cancel active subscription
     */
    public function cancelActiveSubscription(Business $business): bool
    {
        $subscription = $business->activeSubscription;
        
        if (!$subscription) {
            return false;
        }

        $subscription->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        return true;
    }

    /**
     * Check and update expired subscriptions
     */
    public function processExpiredSubscriptions(): int
    {
        $count = 0;
        
        $expiredSubscriptions = BusinessSubscription::where('status', 'active')
            ->where('expires_at', '<', now())
            ->get();

        foreach ($expiredSubscriptions as $subscription) {
            if ($subscription->hasExpired()) {
                $subscription->update(['status' => 'expired']);
                $count++;
            } elseif ($subscription->isInGracePeriod()) {
                $subscription->update(['status' => 'grace']);
            }
        }

        return $count;
    }

    /**
     * Check if business can access the system
     */
    public function canAccess(Business $business): bool
    {
        $subscription = $business->activeSubscription;
        
        if (!$subscription) {
            return false;
        }

        return $subscription->isActive() || $subscription->isInGracePeriod();
    }

    /**
     * Get subscription expiry info
     */
    public function getExpiryInfo(Business $business): array
    {
        $subscription = $business->activeSubscription;
        
        if (!$subscription) {
            return [
                'has_subscription' => false,
                'status' => 'no_subscription',
                'message' => 'আপনার কোনো সাবস্ক্রিপশন নেই।',
            ];
        }

        $daysRemaining = $subscription->getDaysRemaining();
        $warningDays = SubscriptionSetting::getWarningDays();

        return [
            'has_subscription' => true,
            'status' => $business->getSubscriptionStatus(),
            'plan_name' => $subscription->plan->name,
            'is_trial' => $subscription->plan->is_trial,
            'expires_at' => $subscription->expires_at,
            'days_remaining' => $daysRemaining,
            'is_expiring_soon' => $daysRemaining <= $warningDays,
            'is_in_grace' => $subscription->isInGracePeriod(),
            'grace_days_remaining' => $subscription->getDaysRemainingWithGrace(),
            'message' => $this->getExpiryMessage($subscription, $daysRemaining),
        ];
    }

    /**
     * Get expiry message
     */
    protected function getExpiryMessage(BusinessSubscription $subscription, int $daysRemaining): string
    {
        if ($subscription->hasExpired()) {
            return 'আপনার সাবস্ক্রিপশন শেষ হয়ে গেছে। অনুগ্রহ করে নবায়ন করুন।';
        }

        if ($subscription->isInGracePeriod()) {
            $graceDays = $subscription->getDaysRemainingWithGrace();
            return "আপনার সাবস্ক্রিপশন শেষ হয়ে গেছে। আর {$graceDays} দিন সময় আছে।";
        }

        if ($daysRemaining <= 0) {
            return 'আপনার সাবস্ক্রিপশন আজ শেষ হবে।';
        }

        if ($daysRemaining <= 3) {
            return "আপনার সাবস্ক্রিপশন আর {$daysRemaining} দিনে শেষ হবে।";
        }

        return '';
    }

    /**
     * Get subscription stats for admin
     */
    public function getAdminStats(): array
    {
        $total = Business::count();
        $withSubscription = Business::whereHas('activeSubscription')->count();
        $trial = BusinessSubscription::active()->trial()->count();
        $premium = BusinessSubscription::active()->paid()->count();
        $expired = BusinessSubscription::where('status', 'expired')->count();
        
        // Revenue calculation
        $totalRevenue = BusinessSubscription::where('payment_status', 'paid')
            ->where('amount_paid', '>', 0)
            ->sum('amount_paid');
        
        $monthlyRevenue = BusinessSubscription::where('payment_status', 'paid')
            ->where('amount_paid', '>', 0)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('amount_paid');

        return [
            'total_stores' => $total,
            'with_subscription' => $withSubscription,
            'trial_stores' => $trial,
            'premium_stores' => $premium,
            'expired_stores' => $expired,
            'total_revenue' => $totalRevenue,
            'monthly_revenue' => $monthlyRevenue,
        ];
    }
}
