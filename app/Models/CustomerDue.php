<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerDue extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'business_id',
        'party_id',
        'items',
        'total_amount',
        'paid_amount',
        'due_amount',
        'due_date',
        'notes',
        'status',
    ];

    protected $casts = [
        'items' => 'array',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'due_amount' => 'decimal:2',
        'due_date' => 'date',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    public function party(): BelongsTo
    {
        return $this->belongsTo(Party::class);
    }

    /**
     * Generate shareable message for WhatsApp/Messenger
     */
    public function getShareMessage(string $businessName): string
    {
        $message = "🏪 {$businessName}\n";
        $message .= "─────────────────────\n";
        $message .= "প্রিয় {$this->party->name},\n\n";
        $message .= "আপনার বাকি: ৳" . number_format($this->due_amount, 0) . "\n\n";

        if (!empty($this->items)) {
            $message .= "পণ্য তালিকা:\n";
            foreach ($this->items as $item) {
                $message .= "• {$item['name']}";
                if (isset($item['quantity']) && $item['quantity'] > 1) {
                    $message .= " x {$item['quantity']}";
                }
                $message .= " = ৳" . number_format($item['total'], 0) . "\n";
            }
            $message .= "\n";
        }

        $message .= "দয়া করে বাকি পরিশোধ করুন।\nধন্যবাদ! 🙏";

        return $message;
    }
}
