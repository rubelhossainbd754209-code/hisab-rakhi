<?php

namespace App\Http\Middleware;

use App\Models\Business;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackBusinessActivity
{
    /**
     * Handle an incoming request.
     * Track user's business activity for live monitoring
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only track for authenticated users
        if ($request->user()) {
            // Get user's active business from session or first business
            $businessId = session('current_business_id');
            
            if ($businessId) {
                $business = Business::find($businessId);
                if ($business && $business->user_id === $request->user()->id) {
                    // Update activity (max once per minute to reduce DB writes)
                    $lastUpdate = session('last_activity_update');
                    if (!$lastUpdate || now()->diffInSeconds($lastUpdate) > 60) {
                        $business->updateActivity();
                        session(['last_activity_update' => now()]);
                    }
                }
            }
        }

        return $next($request);
    }
}
