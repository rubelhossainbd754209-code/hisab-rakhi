<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsApproved
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        // Super admins and admins bypass approval check
        if ($user->isAdmin()) {
            return $next($request);
        }

        // Check if user is approved and active
        if (!$user->canAccessDashboard()) {
            return Inertia::render('Auth/PendingApproval', [
                'user' => $user->only(['name', 'email', 'is_approved', 'is_active']),
            ])->toResponse($request);
        }

        return $next($request);
    }
}
