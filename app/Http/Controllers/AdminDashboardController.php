<?php

namespace App\Http\Controllers;

use App\Models\CloudinaryAccount;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Display the admin dashboard
     */
    public function index()
    {
        // User Statistics
        $totalUsers = User::where('role', 'user')->count();
        $pendingUsers = User::where('role', 'user')->where('is_approved', false)->count();
        $approvedUsers = User::where('role', 'user')->where('is_approved', true)->count();
        $activeUsers = User::where('role', 'user')->where('is_active', true)->count();
        $inactiveUsers = User::where('role', 'user')->where('is_active', false)->count();
        
        // Users registered today
        $todayUsers = User::where('role', 'user')
            ->whereDate('created_at', Carbon::today())
            ->count();
        
        // Users registered this week
        $weekUsers = User::where('role', 'user')
            ->whereBetween('created_at', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
            ->count();
        
        // Users registered this month
        $monthUsers = User::where('role', 'user')
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->count();

        // User growth data for last 7 days
        $userGrowth = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $count = User::where('role', 'user')
                ->whereDate('created_at', $date)
                ->count();
            $userGrowth[] = [
                'date' => $date->format('d M'),
                'day' => $date->locale('bn')->dayName,
                'count' => $count,
            ];
        }

        // Recent registrations (last 10)
        $recentUsers = User::where('role', 'user')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'is_approved' => $user->is_approved,
                    'is_active' => $user->is_active,
                    'profile_image' => $user->profile_image,
                    'created_at' => $user->created_at->diffForHumans(),
                    'created_date' => $user->created_at->format('d M Y'),
                ];
            });

        // Pending approval users
        $pendingApprovals = User::where('role', 'user')
            ->where('is_approved', false)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'profile_image' => $user->profile_image,
                    'created_at' => $user->created_at->diffForHumans(),
                ];
            });

        // System Status
        $cloudinaryAccount = CloudinaryAccount::active()->first();
        $systemStatus = [
            'server' => 'online',
            'database' => 'connected',
            'cloudinary' => $cloudinaryAccount ? 'configured' : 'not_configured',
            'cloudinary_name' => $cloudinaryAccount?->name,
            'version' => '1.0.0',
            'php_version' => phpversion(),
            'laravel_version' => app()->version(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'pending_users' => $pendingUsers,
                'approved_users' => $approvedUsers,
                'active_users' => $activeUsers,
                'inactive_users' => $inactiveUsers,
                'today_users' => $todayUsers,
                'week_users' => $weekUsers,
                'month_users' => $monthUsers,
            ],
            'user_growth' => $userGrowth,
            'recent_users' => $recentUsers,
            'pending_approvals' => $pendingApprovals,
            'system_status' => $systemStatus,
        ]);
    }

    /**
     * Quick approve a user
     */
    public function quickApprove(User $user)
    {
        $user->update([
            'is_approved' => true,
            'approved_at' => now(),
            'approved_by' => auth()->id(),
        ]);

        return back()->with('success', "'{$user->name}' অনুমোদিত হয়েছে।");
    }
}
