<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductReturn extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'business_id',
        'invoice_id',
        'product_id',
        'return_number',
        'date',
        'quantity',
        'refund_amount',
        'reason',
    ];

    protected $casts = [
        'date' => 'date',
        'quantity' => 'decimal:2',
        'refund_amount' => 'decimal:2',
    ];

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
