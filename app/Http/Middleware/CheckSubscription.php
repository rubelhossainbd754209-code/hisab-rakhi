<?php

namespace App\Http\Middleware;

use App\Models\Business;
use App\Services\SubscriptionService;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    protected SubscriptionService $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    /**
     * Handle an incoming request.
     * Check if the user's business has an active subscription.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip for guests and admins
        if (!$request->user() || $request->user()->isAdmin()) {
            return $next($request);
        }

        // Get current business from session
        $businessId = session('current_business_id');
        
        if (!$businessId) {
            // If no business, let the request through (they may need to create one)
            return $next($request);
        }

        $business = Business::find($businessId);
        
        if (!$business) {
            session()->forget('current_business_id');
            return $next($request);
        }

        // Check if business has active subscription
        if (!$this->subscriptionService->canAccess($business)) {
            // Get subscription info for the expired page
            $expiryInfo = $this->subscriptionService->getExpiryInfo($business);
            
            // Allow access to specific routes even when expired
            $allowedPaths = [
                'subscription',
                'subscription/*',
                'profile',
                'logout',
                'api/subscription/*',
            ];

            $currentPath = $request->path();
            foreach ($allowedPaths as $pattern) {
                if (fnmatch($pattern, $currentPath)) {
                    return $next($request);
                }
            }

            // Redirect to subscription expired page
            return Inertia::render('Subscription/Expired', [
                'business' => [
                    'id' => $business->id,
                    'name' => $business->name,
                    'slug' => $business->slug,
                ],
                'expiry_info' => $expiryInfo,
            ])->toResponse($request);
        }

        // Check if subscription is about to expire (warning)
        $subscription = $business->activeSubscription;
        if ($subscription && $subscription->isAboutToExpire()) {
            // Share warning with all views
            Inertia::share('subscription_warning', [
                'show' => true,
                'days_remaining' => $subscription->getDaysRemaining(),
                'is_trial' => $subscription->plan->is_trial,
                'message' => $subscription->plan->is_trial 
                    ? "আপনার ফ্রি ট্রায়াল আর {$subscription->getDaysRemaining()} দিনে শেষ হবে।" 
                    : "আপনার সাবস্ক্রিপশন আর {$subscription->getDaysRemaining()} দিনে শেষ হবে।",
            ]);
        }

        return $next($request);
    }
}
