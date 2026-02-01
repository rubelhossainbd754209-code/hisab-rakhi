<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Business extends Model
{
    protected $fillable = [
        'user_id',
        'template_id',
        'name',
        'slug',
        'logo',
        'phone',
        'email',
        'address',
        'settings',
        'is_active',
        'onboarding_completed_at',
        'last_activity_at',
        'is_online',
    ];

    protected $casts = [
        'settings' => 'array',
        'is_active' => 'boolean',
        'is_online' => 'boolean',
        'onboarding_completed_at' => 'datetime',
        'last_activity_at' => 'datetime',
    ];

    protected $appends = ['logo_url'];

    /**
     * Get the full logo URL
     */
    public function getLogoUrlAttribute(): ?string
    {
        if (!$this->logo) {
            return null;
        }
        
        // If it's already a full URL, return as is
        if (str_starts_with($this->logo, 'http')) {
            return $this->logo;
        }
        
        // If it's an emoji (short string), return as is
        if (strlen($this->logo) <= 4) {
            return $this->logo;
        }
        
        // Return storage URL
        return asset('storage/' . $this->logo);
    }

    /**
     * Get the owner
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the template
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(BusinessTemplate::class, 'template_id');
    }

    /**
     * Get all subscriptions
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(BusinessSubscription::class);
    }

    /**
     * Get current active subscription
     */
    public function activeSubscription(): HasOne
    {
        return $this->hasOne(BusinessSubscription::class)
            ->where('status', 'active')
            ->where('expires_at', '>', now())
            ->latest();
    }

    /**
     * Check if business has active subscription
     */
    public function hasActiveSubscription(): bool
    {
        return $this->activeSubscription()->exists();
    }

    /**
     * Check if business is in trial
     */
    public function isInTrial(): bool
    {
        $subscription = $this->activeSubscription;
        return $subscription && $subscription->plan->is_trial;
    }

    /**
     * Check if business has premium subscription
     */
    public function isPremium(): bool
    {
        $subscription = $this->activeSubscription;
        return $subscription && !$subscription->plan->is_trial;
    }

    /**
     * Check if subscription is about to expire
     */
    public function isSubscriptionExpiring(int $days = 3): bool
    {
        $subscription = $this->activeSubscription;
        return $subscription && $subscription->isAboutToExpire($days);
    }

    /**
     * Get subscription status
     */
    public function getSubscriptionStatus(): string
    {
        $subscription = $this->activeSubscription;
        
        if (!$subscription) {
            return 'no_subscription';
        }
        
        if ($subscription->hasExpired()) {
            return 'expired';
        }
        
        if ($subscription->isInGracePeriod()) {
            return 'grace';
        }
        
        if ($subscription->plan->is_trial) {
            return 'trial';
        }
        
        return 'premium';
    }

    /**
     * Check if onboarding is complete
     */
    public function isOnboardingComplete(): bool
    {
        return $this->onboarding_completed_at !== null;
    }

    /**
     * Check if business is currently online (active in last 5 minutes)
     */
    public function isCurrentlyOnline(): bool
    {
        if (!$this->last_activity_at) {
            return false;
        }
        
        return $this->last_activity_at->diffInMinutes(now()) < 5;
    }

    /**
     * Update activity timestamp
     */
    public function updateActivity(): void
    {
        $this->update([
            'last_activity_at' => now(),
            'is_online' => true,
        ]);
    }

    /**
     * Mark as offline
     */
    public function markOffline(): void
    {
        $this->update(['is_online' => false]);
    }

    /**
     * Scope for online businesses
     */
    public function scopeOnline($query)
    {
        return $query->where('is_online', true)
            ->where('last_activity_at', '>=', Carbon::now()->subMinutes(5));
    }

    /**
     * Get merged settings (template config + business specific)
     */
    public function getMergedSettings(): array
    {
        $templateConfig = $this->template?->getMergedConfig() ?? [];
        $businessSettings = $this->settings ?? [];
        
        return array_merge($templateConfig, $businessSettings);
    }

    /**
     * Get a setting value
     */
    public function getSetting(string $key, $default = null)
    {
        return $this->settings[$key] ?? $this->template?->config[$key] ?? $default;
    }

    /**
     * Get terminology
     */
    public function getTerminology(string $key, string $default = null): string
    {
        return $this->settings['terminology'][$key] 
            ?? $this->template?->getTerminology($key, $default) 
            ?? $default 
            ?? $key;
    }

    /**
     * Scope for active businesses
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Generate unique slug
     */
    public static function generateSlug(string $name): string
    {
        $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', $name));
        $slug = trim($slug, '-');
        
        $originalSlug = $slug;
        $count = 1;
        
        while (self::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }
        
        return $slug;
    }
}
