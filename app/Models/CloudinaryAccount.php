<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class CloudinaryAccount extends Model
{
    protected $fillable = [
        'name',
        'cloud_name',
        'api_key',
        'api_secret',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Encrypt API key before saving
     */
    public function setApiKeyAttribute($value): void
    {
        $this->attributes['api_key'] = Crypt::encryptString($value);
    }

    /**
     * Decrypt API key when retrieving
     */
    public function getApiKeyAttribute($value): string
    {
        try {
            return Crypt::decryptString($value);
        } catch (\Exception $e) {
            return $value;
        }
    }

    /**
     * Encrypt API secret before saving
     */
    public function setApiSecretAttribute($value): void
    {
        $this->attributes['api_secret'] = Crypt::encryptString($value);
    }

    /**
     * Decrypt API secret when retrieving
     */
    public function getApiSecretAttribute($value): string
    {
        try {
            return Crypt::decryptString($value);
        } catch (\Exception $e) {
            return $value;
        }
    }

    /**
     * Scope to get active account
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Activate this account and deactivate others
     */
    public function activate(): bool
    {
        // Deactivate all other accounts
        static::where('id', '!=', $this->id)->update(['is_active' => false]);
        
        // Activate this account
        return $this->update(['is_active' => true]);
    }

    /**
     * Deactivate this account
     */
    public function deactivate(): bool
    {
        return $this->update(['is_active' => false]);
    }

    /**
     * Get the Cloudinary URL for this account
     */
    public function getCloudinaryUrl(): string
    {
        return "cloudinary://{$this->api_key}:{$this->api_secret}@{$this->cloud_name}";
    }
}
