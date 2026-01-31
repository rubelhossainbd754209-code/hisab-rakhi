<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'business' => function () use ($request) {
                    if (!$request->user()) return null;
                    $business = \App\Models\Business::where('user_id', $request->user()->id)
                        ->with(['template.category', 'activeSubscription.plan'])
                        ->first();
                    
                    if ($business) {
                        // Add subscription info to business
                        $subscription = $business->activeSubscription;
                        $business->subscription_status = $business->getSubscriptionStatus();
                        $business->is_trial = $business->isInTrial();
                        $business->is_premium = $business->isPremium();
                        $business->days_remaining = $subscription ? $subscription->getDaysRemaining() : 0;
                        $business->plan_name = $subscription?->plan?->name ?? null;
                    }
                    
                    return $business;
                },
                'pending_users_count' => function () use ($request) {
                    if ($request->user() && $request->user()->isAdmin()) {
                        return \App\Models\User::where('role', 'user')
                            ->where('is_approved', false)
                            ->count();
                    }
                    return 0;
                },
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
