<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SubscriptionPlan extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'duration_days',
        'billing_cycle',
        'features',
        'limits',
        'is_trial',
        'is_popular',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'features' => 'array',
        'limits' => 'array',
        'is_trial' => 'boolean',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get all subscriptions for this plan
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(BusinessSubscription::class, 'plan_id');
    }

    /**
     * Scope for active plans
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for trial plan
     */
    public function scopeTrial($query)
    {
        return $query->where('is_trial', true);
    }

    /**
     * Scope for paid plans
     */
    public function scopePaid($query)
    {
        return $query->where('is_trial', false)->where('price', '>', 0);
    }

    /**
     * Check if plan has a specific feature
     */
    public function hasFeature(string $feature): bool
    {
        return in_array($feature, $this->features ?? []);
    }

    /**
     * Get limit value
     */
    public function getLimit(string $key, $default = null)
    {
        return $this->limits[$key] ?? $default;
    }

    /**
     * Get formatted price
     */
    public function getFormattedPriceAttribute(): string
    {
        if ($this->price == 0) {
            return 'বিনামূল্যে';
        }
        return '৳' . number_format($this->price, 0);
    }

    /**
     * Get duration text
     */
    public function getDurationTextAttribute(): string
    {
        if ($this->duration_days == 30) {
            return '১ মাস';
        } elseif ($this->duration_days == 365) {
            return '১ বছর';
        } elseif ($this->duration_days == 15) {
            return '১৫ দিন';
        }
        return $this->duration_days . ' দিন';
    }
}
