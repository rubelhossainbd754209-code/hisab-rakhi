<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Middleware\EnsureUserIsApproved;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Controllers\CloudinaryAccountController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminDashboardController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Authentication Routes (Guest only)
Route::middleware('guest')->group(function () {
    // Login
    Route::get('/login', function () {
        return Inertia::render('Auth/Login');
    })->name('login');

    Route::post('/login', function (Request $request) {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            
            $user = Auth::user();
            
            // Redirect admins to admin dashboard
            if ($user->isAdmin()) {
                return redirect('/admin');
            }
            
            return redirect()->intended('/dashboard');
        }

        return back()->withErrors([
            'email' => 'ইমেইল বা পাসওয়ার্ড সঠিক নয়।',
        ])->onlyInput('email');
    });

    // Register
    Route::get('/register', function () {
        return Inertia::render('Auth/Register');
    })->name('register');

    Route::post('/register', function (Request $request) {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'name.required' => 'নাম দিন।',
            'email.required' => 'ইমেইল দিন।',
            'email.email' => 'সঠিক ইমেইল দিন।',
            'email.unique' => 'এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট আছে।',
            'password.required' => 'পাসওয়ার্ড দিন।',
            'password.min' => 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে।',
            'password.confirmed' => 'পাসওয়ার্ড মিলছে না।',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => 'user',
            'is_approved' => false, // Requires admin approval
            'is_active' => true,
        ]);

        Auth::login($user);

        return redirect('/dashboard');
    });

    // Forgot Password
    Route::get('/forgot-password', function () {
        return Inertia::render('Auth/ForgotPassword');
    })->name('password.request');
});

// Logout
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
})->middleware('auth')->name('logout');

// Protected Routes (require authentication AND approval)
Route::middleware(['auth', EnsureUserIsApproved::class])->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard/Index');
    })->name('dashboard');

    // Onboarding
    Route::get('/onboarding', function () {
        return Inertia::render('Onboarding/Index', [
            'categories' => [],
            'templates' => [],
            'logoLibrary' => [],
        ]);
    })->name('onboarding');

    Route::post('/onboarding/complete', function (Request $request) {
        return redirect('/dashboard');
    })->name('onboarding.complete');

    // Transactions
    Route::prefix('transactions')->name('transactions.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Transactions/Index');
        })->name('index');
        
        Route::post('/', function (Request $request) {
            // TODO: Save transaction
            return back()->with('success', 'লেনদেন সফলভাবে সেভ হয়েছে।');
        })->name('store');
    });

    // Parties
    Route::prefix('parties')->name('parties.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Parties/Index');
        })->name('index');
    });

    // Products
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Products/Index');
        })->name('index');
    });

    // Invoices
    Route::prefix('invoices')->name('invoices.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Invoices/Index');
        })->name('index');
    });

    // Reports
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Reports/Index');
        })->name('index');
    });

    // Settings
    Route::get('/settings', function () {
        return Inertia::render('Settings/Index');
    })->name('settings');

    // Profile
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'index'])->name('index');
        Route::put('/', [ProfileController::class, 'update'])->name('update');
        Route::post('/image', [ProfileController::class, 'updateImage'])->name('image.update');
        Route::delete('/image', [ProfileController::class, 'removeImage'])->name('image.remove');
        Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
    });
});

// Admin Routes
Route::middleware(['auth', EnsureUserIsAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
    Route::post('/users/{user}/quick-approve', [AdminDashboardController::class, 'quickApprove'])->name('quick-approve');

    // Users Management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', function (Request $request) {
            $query = User::where('role', 'user');
            
            if ($request->filter === 'pending') {
                $query->where('is_approved', false);
            } elseif ($request->filter === 'approved') {
                $query->where('is_approved', true);
            } elseif ($request->filter === 'inactive') {
                $query->where('is_active', false);
            }
            
            $users = $query->orderBy('created_at', 'desc')->get();
            
            return Inertia::render('Admin/Users/Index', [
                'users' => $users,
                'filter' => $request->filter,
            ]);
        })->name('index');
        
        // Approve User
        Route::post('/{user}/approve', function (User $user) {
            $user->update([
                'is_approved' => true,
                'approved_at' => now(),
                'approved_by' => Auth::id(),
            ]);
            
            return back()->with('success', 'ব্যবহারকারী অনুমোদিত হয়েছে।');
        })->name('approve');
        
        // Reject User
        Route::post('/{user}/reject', function (User $user) {
            $user->delete();
            return back()->with('success', 'ব্যবহারকারী মুছে ফেলা হয়েছে।');
        })->name('reject');
        
        // Toggle Active Status
        Route::post('/{user}/toggle-active', function (User $user) {
            $user->update(['is_active' => !$user->is_active]);
            $status = $user->is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়';
            return back()->with('success', "ব্যবহারকারী {$status} করা হয়েছে।");
        })->name('toggle-active');
    });

    // Categories
    Route::get('/categories', function () {
        return Inertia::render('Admin/Categories/Index');
    })->name('categories.index');

    // Templates
    Route::get('/templates', function () {
        return Inertia::render('Admin/Templates/Index');
    })->name('templates.index');

    // Businesses
    Route::get('/businesses', function () {
        return Inertia::render('Admin/Businesses/Index');
    })->name('businesses.index');

    // Settings
    Route::get('/settings', function () {
        return Inertia::render('Admin/Settings/Index');
    })->name('settings.index');

    // Cloudinary Accounts Management
    Route::prefix('cloudinary')->name('cloudinary.')->group(function () {
        Route::get('/', [CloudinaryAccountController::class, 'index'])->name('index');
        Route::post('/', [CloudinaryAccountController::class, 'store'])->name('store');
        Route::put('/{cloudinary}', [CloudinaryAccountController::class, 'update'])->name('update');
        Route::delete('/{cloudinary}', [CloudinaryAccountController::class, 'destroy'])->name('destroy');
        Route::post('/{cloudinary}/activate', [CloudinaryAccountController::class, 'activate'])->name('activate');
        Route::post('/test-connection', [CloudinaryAccountController::class, 'testConnection'])->name('test');
    });
});
