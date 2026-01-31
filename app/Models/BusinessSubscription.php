<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BusinessSubscription extends Model
{
    protected $fillable = [
        'business_id',
        'plan_id',
        'started_at',
        'expires_at',
        'cancelled_at',
        'amount_paid',
        'payment_status',
        'payment_method',
        'transaction_id',
        'status',
        'auto_renew',
        'grace_days',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'amount_paid' => 'decimal:2',
        'auto_renew' => 'boolean',
    ];

    /**
     * Get the business
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the plan
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(SubscriptionPlan::class, 'plan_id');
    }

    /**
     * Check if subscription is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active' && $this->expires_at->isFuture();
    }

    /**
     * Check if in grace period
     */
    public function isInGracePeriod(): bool
    {
        if ($this->expires_at->isFuture()) {
            return false;
        }
        
        $graceEnd = $this->expires_at->addDays($this->grace_days);
        return $graceEnd->isFuture();
    }

    /**
     * Check if subscription has expired (including grace period)
     */
    public function hasExpired(): bool
    {
        $graceEnd = $this->expires_at->addDays($this->grace_days);
        return $graceEnd->isPast();
    }

    /**
     * Get days remaining
     */
    public function getDaysRemaining(): int
    {
        if ($this->expires_at->isPast()) {
            return 0;
        }
        return $this->expires_at->diffInDays(now());
    }

    /**
     * Get days remaining including grace
     */
    public function getDaysRemainingWithGrace(): int
    {
        $graceEnd = $this->expires_at->addDays($this->grace_days);
        if ($graceEnd->isPast()) {
            return 0;
        }
        return $graceEnd->diffInDays(now());
    }

    /**
     * Check if trial is about to expire (within warning days)
     */
    public function isAboutToExpire(int $warningDays = 3): bool
    {
        if ($this->expires_at->isPast()) {
            return false;
        }
        return $this->getDaysRemaining() <= $warningDays;
    }

    /**
     * Scope for active subscriptions
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
            ->where('expires_at', '>', now());
    }

    /**
     * Scope for expired subscriptions
     */
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now())
            ->whereRaw('DATE_ADD(expires_at, INTERVAL grace_days DAY) < NOW()');
    }

    /**
     * Scope for trial subscriptions
     */
    public function scopeTrial($query)
    {
        return $query->whereHas('plan', function ($q) {
            $q->where('is_trial', true);
        });
    }

    /**
     * Scope for paid subscriptions
     */
    public function scopePaid($query)
    {
        return $query->whereHas('plan', function ($q) {
            $q->where('is_trial', false);
        });
    }
}
