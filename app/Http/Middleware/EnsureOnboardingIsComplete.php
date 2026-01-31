<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOnboardingIsComplete
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Admin users can bypass onboarding or handle it differently
        if ($user && $user->isAdmin()) {
            return $next($request);
        }

        // If user is logged in but has no business setup, redirect to onboarding
        // We assume the first business is the primary one for now
        $business = \App\Models\Business::where('user_id', $user->id)->first();

        // If no business or onboarding not complete, redirect
        if (!$business || !$business->onboarding_completed_at) {
            if (!$request->is('onboarding*')) {
                return redirect()->route('onboarding');
            }
        }

        // If user has business and is on onboarding, redirect to dashboard
        if ($business && $business->onboarding_completed_at && $request->is('onboarding*')) {
            return redirect()->route('dashboard');
        }

        return $next($request);
    }
}
