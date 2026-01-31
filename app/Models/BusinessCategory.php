<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BusinessCategory extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'icon',
        'image',
        'description',
        'config',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'config' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Get templates for this category
     */
    public function templates(): HasMany
    {
        return $this->hasMany(BusinessTemplate::class, 'category_id');
    }

    /**
     * Get active templates
     */
    public function activeTemplates(): HasMany
    {
        return $this->templates()->where('is_active', true);
    }

    /**
     * Scope for active categories
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for ordered categories
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }
}
