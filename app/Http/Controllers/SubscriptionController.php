<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\SubscriptionPlan;
use App\Models\SubscriptionSetting;
use App\Services\SubscriptionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    protected SubscriptionService $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    /**
     * Public pricing page
     */
    public function pricing()
    {
        $plans = SubscriptionPlan::active()
            ->orderBy('sort_order')
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'slug' => $plan->slug,
                    'description' => $plan->description,
                    'price' => $plan->price,
                    'duration_days' => $plan->duration_days,
                    'billing_cycle' => $plan->billing_cycle,
                    'features' => $plan->features,
                    'limits' => $plan->limits,
                    'is_trial' => $plan->is_trial,
                    'is_popular' => $plan->is_popular,
                ];
            });

        return Inertia::render('Pricing', [
            'plans' => $plans,
        ]);
    }

    /**
     * Show subscription plans for user
     */
    public function plans()
    {
        $plans = SubscriptionPlan::active()
            ->orderBy('sort_order')
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'slug' => $plan->slug,
                    'description' => $plan->description,
                    'price' => $plan->price,
                    'formatted_price' => $plan->formatted_price,
                    'duration_days' => $plan->duration_days,
                    'duration_text' => $plan->duration_text,
                    'billing_cycle' => $plan->billing_cycle,
                    'features' => $plan->features,
                    'limits' => $plan->limits,
                    'is_trial' => $plan->is_trial,
                    'is_popular' => $plan->is_popular,
                ];
            });

        // Get current business subscription info
        $businessId = session('current_business_id');
        $currentSubscription = null;
        
        if ($businessId) {
            $business = Business::find($businessId);
            if ($business) {
                $currentSubscription = $this->subscriptionService->getExpiryInfo($business);
            }
        }

        return Inertia::render('Subscription/Plans', [
            'plans' => $plans,
            'current_subscription' => $currentSubscription,
        ]);
    }

    /**
     * Show subscription status for current business
     */
    public function status()
    {
        $businessId = session('current_business_id');
        
        if (!$businessId) {
            return redirect()->route('dashboard')->with('error', 'কোনো ব্যবসা নির্বাচিত নেই।');
        }

        $business = Business::with(['activeSubscription.plan', 'subscriptions.plan'])
            ->find($businessId);

        if (!$business) {
            return redirect()->route('dashboard')->with('error', 'ব্যবসা পাওয়া যায়নি।');
        }

        $expiryInfo = $this->subscriptionService->getExpiryInfo($business);

        return Inertia::render('Subscription/Status', [
            'business' => [
                'id' => $business->id,
                'name' => $business->name,
                'slug' => $business->slug,
            ],
            'expiry_info' => $expiryInfo,
            'subscription_history' => $business->subscriptions->map(function ($sub) {
                return [
                    'id' => $sub->id,
                    'plan_name' => $sub->plan->name,
                    'started_at' => $sub->started_at->format('d M Y'),
                    'expires_at' => $sub->expires_at->format('d M Y'),
                    'status' => $sub->status,
                    'amount_paid' => $sub->amount_paid,
                    'payment_method' => $sub->payment_method,
                ];
            }),
        ]);
    }

    /**
     * Admin: List all subscription plans
     */
    public function adminPlans()
    {
        $plans = SubscriptionPlan::orderBy('sort_order')->get();
        $settings = SubscriptionSetting::all()->pluck('value', 'key');

        return Inertia::render('Admin/Subscriptions/Plans', [
            'plans' => $plans,
            'settings' => $settings,
        ]);
    }

    /**
     * Admin: Update subscription plan
     */
    public function adminUpdatePlan(Request $request, SubscriptionPlan $plan)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'duration_days' => ['required', 'integer', 'min:1'],
            'features' => ['nullable', 'array'],
            'limits' => ['nullable', 'array'],
            'is_active' => ['boolean'],
            'is_popular' => ['boolean'],
        ]);

        $plan->update($validated);

        return back()->with('success', 'প্ল্যান আপডেট হয়েছে।');
    }

    /**
     * Admin: Update subscription settings
     */
    public function adminUpdateSettings(Request $request)
    {
        $validated = $request->validate([
            'trial_duration_days' => ['required', 'integer', 'min:1', 'max:90'],
            'grace_period_days' => ['required', 'integer', 'min:0', 'max:30'],
            'show_trial_warning_days' => ['required', 'integer', 'min:1', 'max:14'],
        ]);

        foreach ($validated as $key => $value) {
            SubscriptionSetting::setValue($key, $value);
        }

        return back()->with('success', 'সেটিংস আপডেট হয়েছে।');
    }

    /**
     * Admin: View all business subscriptions
     */
    public function adminSubscriptions(Request $request)
    {
        $query = Business::with(['user:id,name,email', 'activeSubscription.plan', 'template.category:id,name,icon']);

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('user', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        if ($request->filter === 'trial') {
            $query->whereHas('activeSubscription', function ($q) {
                $q->whereHas('plan', function ($p) {
                    $p->where('is_trial', true);
                });
            });
        } elseif ($request->filter === 'premium') {
            $query->whereHas('activeSubscription', function ($q) {
                $q->whereHas('plan', function ($p) {
                    $p->where('is_trial', false);
                });
            });
        } elseif ($request->filter === 'expired') {
            $query->whereDoesntHave('activeSubscription');
        } elseif ($request->filter === 'unlimited') {
            $query->whereHas('activeSubscription', function ($q) {
                $q->where('expires_at', '>', now()->addYears(50));
            });
        }

        $businesses = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(function ($business) {
                $subscription = $business->activeSubscription;
                $isUnlimited = $subscription && $subscription->expires_at->year >= 2099;
                return [
                    'id' => $business->id,
                    'name' => $business->name,
                    'slug' => $business->slug,
                    'phone' => $business->phone,
                    'owner' => $business->user ? [
                        'name' => $business->user->name,
                        'email' => $business->user->email,
                    ] : null,
                    'category' => $business->template?->category?->name,
                    'category_icon' => $business->template?->category?->icon,
                    'subscription' => $subscription ? [
                        'id' => $subscription->id,
                        'plan' => $subscription->plan->name,
                        'is_trial' => $subscription->plan->is_trial,
                        'expires_at' => $subscription->expires_at->format('d M Y'),
                        'expires_at_raw' => $subscription->expires_at->toDateString(),
                        'days_remaining' => $subscription->getDaysRemaining(),
                        'status' => $subscription->status,
                        'is_unlimited' => $isUnlimited,
                    ] : null,
                    'status' => $business->getSubscriptionStatus(),
                    'created_at' => $business->created_at->format('d M Y'),
                ];
            });

        $stats = $this->subscriptionService->getAdminStats();

        // Get all plans for dropdown
        $plans = SubscriptionPlan::active()->orderBy('sort_order')->get(['id', 'name', 'duration_days', 'is_trial']);

        return Inertia::render('Admin/Subscriptions/Index', [
            'businesses' => $businesses,
            'stats' => $stats,
            'filter' => $request->filter,
            'search' => $request->search,
            'plans' => $plans,
        ]);
    }

    /**
     * Admin: Extend or reduce subscription time for a business
     */
    public function adminExtendSubscription(Request $request, Business $business)
    {
        $validated = $request->validate([
            'days' => ['required', 'integer', 'min:-365', 'max:365'],
            'action' => ['required', 'in:add,subtract,set'],
            'new_date' => ['required_if:action,set', 'date'],
        ], [
            'days.required' => 'দিন সংখ্যা দিতে হবে।',
            'days.min' => 'সর্বনিম্ন -৩৬৫ দিন কমাতে পারবেন।',
            'days.max' => 'সর্বোচ্চ ৩৬৫ দিন বাড়াতে পারবেন।',
        ]);

        $subscription = $business->activeSubscription;

        if (!$subscription) {
            return back()->with('error', 'এই বিজনেসের কোনো সক্রিয় সাবস্ক্রিপশন নেই।');
        }

        if ($validated['action'] === 'add') {
            $subscription->expires_at = $subscription->expires_at->addDays($validated['days']);
        } elseif ($validated['action'] === 'subtract') {
            $subscription->expires_at = $subscription->expires_at->subDays($validated['days']);
        } elseif ($validated['action'] === 'set') {
            $subscription->expires_at = $validated['new_date'];
        }

        $subscription->save();

        return back()->with('success', "সাবস্ক্রিপশন সময় আপডেট হয়েছে। নতুন মেয়াদ: {$subscription->expires_at->format('d M Y')}");
    }

    /**
     * Admin: Set unlimited subscription for a business
     */
    public function adminSetUnlimited(Request $request, Business $business)
    {
        $subscription = $business->activeSubscription;

        if (!$subscription) {
            // Create a new subscription with premium plan
            $premiumPlan = SubscriptionPlan::where('is_trial', false)->first();
            
            if (!$premiumPlan) {
                return back()->with('error', 'কোনো প্রিমিয়াম প্ল্যান পাওয়া যায়নি।');
            }

            $subscription = $business->subscriptions()->create([
                'plan_id' => $premiumPlan->id,
                'started_at' => now(),
                'expires_at' => now()->addYears(100), // 100 years = unlimited
                'status' => 'active',
                'payment_status' => 'paid',
                'payment_method' => 'admin_granted',
                'amount_paid' => 0,
            ]);
        } else {
            // Update existing subscription to unlimited
            $subscription->update([
                'expires_at' => now()->addYears(100),
                'status' => 'active',
            ]);
        }

        return back()->with('success', "{$business->name} বিজনেসকে আনলিমিটেড সাবস্ক্রিপশন দেওয়া হয়েছে।");
    }

    /**
     * Admin: Revoke subscription from a business
     */
    public function adminRevokeSubscription(Request $request, Business $business)
    {
        $subscription = $business->activeSubscription;

        if (!$subscription) {
            return back()->with('error', 'এই বিজনেসের কোনো সক্রিয় সাবস্ক্রিপশন নেই।');
        }

        $subscription->update([
            'status' => 'cancelled',
            'cancelled_at' => now(),
        ]);

        return back()->with('success', "{$business->name} এর সাবস্ক্রিপশন বাতিল করা হয়েছে।");
    }

    /**
     * Admin: Assign a plan to a business
     */
    public function adminAssignPlan(Request $request, Business $business)
    {
        $validated = $request->validate([
            'plan_id' => ['required', 'exists:subscription_plans,id'],
            'duration_days' => ['nullable', 'integer', 'min:1'],
        ]);

        $plan = SubscriptionPlan::find($validated['plan_id']);
        $durationDays = $validated['duration_days'] ?? $plan->duration_days;

        // Cancel any existing active subscription
        $existingSubscription = $business->activeSubscription;
        if ($existingSubscription) {
            $existingSubscription->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);
        }

        // Create new subscription
        $business->subscriptions()->create([
            'plan_id' => $plan->id,
            'started_at' => now(),
            'expires_at' => now()->addDays($durationDays),
            'status' => 'active',
            'payment_status' => 'paid',
            'payment_method' => 'admin_granted',
            'amount_paid' => 0,
        ]);

        return back()->with('success', "{$business->name} বিজনেসে {$plan->name} প্ল্যান ({$durationDays} দিন) দেওয়া হয়েছে।");
    }
}

