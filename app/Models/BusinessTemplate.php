<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessTemplate extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'thumbnail',
        'description',
        'config',
        'is_default',
        'is_active',
    ];

    protected $casts = [
        'config' => 'array',
        'is_default' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the category
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(BusinessCategory::class, 'category_id');
    }

    /**
     * Get businesses using this template
     */
    public function businesses(): HasMany
    {
        return $this->hasMany(Business::class, 'template_id');
    }

    /**
     * Scope for active templates
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get merged config (category defaults + template specific)
     */
    public function getMergedConfig(): array
    {
        $categoryConfig = $this->category?->config ?? [];
        $templateConfig = $this->config ?? [];
        
        return array_merge($categoryConfig, $templateConfig);
    }

    /**
     * Get terminology from config
     */
    public function getTerminology(string $key, string $default = null): string
    {
        return $this->config['terminology'][$key] ?? $default ?? $key;
    }

    /**
     * Get color from config
     */
    public function getColor(string $key): string
    {
        return $this->config['colors'][$key] ?? '#006A4E';
    }
}
