<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\Transaction;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Redirect admins to admin dashboard
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        
        // Get primary business
        $business = Business::where('user_id', $user->id)
            ->with(['template.category'])
            ->first();

        if (!$business) {
            return redirect()->route('onboarding');
        }

        // Calculate Real Statistics
        $today = Carbon::today();
        
        $todayIncome = Transaction::where('business_id', $business->id)
            ->whereIn('type', ['income', 'sale', 'payment_in'])
            ->whereDate('transaction_date', $today)
            ->sum('amount');
            
        $todayExpense = Transaction::where('business_id', $business->id)
            ->whereIn('type', ['expense', 'purchase', 'payment_out'])
            ->whereDate('transaction_date', $today)
            ->sum('amount');
            
        $receivable = Transaction::where('business_id', $business->id)
            ->where('type', 'sale')
            ->sum('amount') - Transaction::where('business_id', $business->id)
            ->where('type', 'payment_in')
            ->sum('amount');
            
        $payable = Transaction::where('business_id', $business->id)
            ->where('type', 'purchase')
            ->sum('amount') - Transaction::where('business_id', $business->id)
            ->where('type', 'payment_out')
            ->sum('amount');

        $lowStockCount = Product::where('business_id', $business->id)
            ->whereRaw('stock <= alert_quantity')
            ->count();

        $recentTransactions = Transaction::where('business_id', $business->id)
            ->with('party')
            ->latest()
            ->limit(5)
            ->get();

        $stats = [
            'today_income' => (float)$todayIncome,
            'today_expense' => (float)$todayExpense,
            'today_profit' => (float)($todayIncome - $todayExpense),
            'total_receivable' => (float)max(0, $receivable),
            'total_payable' => (float)max(0, $payable),
            'low_stock_count' => $lowStockCount,
            'pending_invoices' => 0, // Logic for this can be added later
            'recent_transactions' => $recentTransactions,
        ];

        return Inertia::render('Dashboard/Index', [
            'stats' => $stats,
            'business' => $business,
            'template' => $business->template,
        ]);
    }
}
