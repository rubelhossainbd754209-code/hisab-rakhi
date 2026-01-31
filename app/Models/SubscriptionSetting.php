<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'description',
    ];

    /**
     * Get a setting value by key
     */
    public static function getValue(string $key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        
        if (!$setting) {
            return $default;
        }

        return self::castValue($setting->value, $setting->type);
    }

    /**
     * Set a setting value
     */
    public static function setValue(string $key, $value): bool
    {
        return self::where('key', $key)->update(['value' => $value]) > 0;
    }

    /**
     * Cast value to proper type
     */
    protected static function castValue($value, string $type)
    {
        return match ($type) {
            'integer' => (int) $value,
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'json' => json_decode($value, true),
            'float' => (float) $value,
            default => $value,
        };
    }

    /**
     * Get trial duration in days
     */
    public static function getTrialDuration(): int
    {
        return self::getValue('trial_duration_days', 15);
    }

    /**
     * Get grace period in days
     */
    public static function getGracePeriod(): int
    {
        return self::getValue('grace_period_days', 3);
    }

    /**
     * Check if auto trial is enabled
     */
    public static function isAutoTrialEnabled(): bool
    {
        return self::getValue('auto_trial_on_signup', true);
    }

    /**
     * Get warning days before trial expires
     */
    public static function getWarningDays(): int
    {
        return self::getValue('show_trial_warning_days', 3);
    }
}
