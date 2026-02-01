<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Middleware\EnsureUserIsApproved;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\EnsureOnboardingIsComplete;
use App\Http\Controllers\CloudinaryAccountController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\TemplateController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProductReturnController;
use App\Http\Controllers\BusinessSettingsController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// Public Pricing Page
Route::get('/pricing', [SubscriptionController::class, 'pricing'])->name('pricing');

// Authentication Routes (Guest only)
Route::middleware('guest')->group(function () {
    // Login
    Route::get('/login', function () {
        $stats = [
            'total_businesses' => \App\Models\Business::count(),
            'total_transactions' => \App\Models\Transaction::count(),
        ];
        return Inertia::render('Auth/Login', ['stats' => $stats]);
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
        $stats = [
            'total_businesses' => \App\Models\Business::count(),
            'total_transactions' => \App\Models\Transaction::count(),
        ];
        return Inertia::render('Auth/Register', ['stats' => $stats]);
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

// Onboarding (Require auth & approval but NOT completion yet)
Route::middleware(['auth', EnsureUserIsApproved::class])->group(function () {
    Route::get('/onboarding', function () {
        $moduleMap = [
            'transactions' => ['name_bn' => 'দৈনিক হিসাব', 'icon' => '📅', 'is_default' => true, 'is_required' => true],
            'parties' => ['name_bn' => 'পার্টি হিসাব', 'icon' => '👥', 'is_default' => true, 'is_required' => true],
            'inventory' => ['name_bn' => 'পণ্য মজুদ', 'icon' => '📦', 'is_default' => true, 'is_required' => false],
            'billing' => ['name_bn' => 'বিল তৈরি', 'icon' => '🧾', 'is_default' => true, 'is_required' => false],
            'reports' => ['name_bn' => 'রিপোর্ট', 'icon' => '📊', 'is_default' => true, 'is_required' => false],
            'barcode' => ['name_bn' => 'বারকোড স্ক্যান', 'icon' => '📱', 'is_default' => true, 'is_required' => false],
            'sms' => ['name_bn' => 'SMS রিমাইন্ডার', 'icon' => '📲', 'is_default' => false, 'is_required' => false],
        ];

        return Inertia::render('Onboarding/Index', [
            'categories' => \App\Models\BusinessCategory::active()->ordered()->get(),
            'templates' => \App\Models\BusinessTemplate::active()->get()->map(function ($template) use ($moduleMap) {
                $templateModules = [];
                $rawModules = $template->config['modules'] ?? [];
                
                foreach ($rawModules as $index => $modKey) {
                    if (isset($moduleMap[$modKey])) {
                        $templateModules[] = array_merge(['id' => $modKey, 'sort_order' => $index + 1], $moduleMap[$modKey]);
                    } else {
                        // Fallback for unknown modules
                        $templateModules[] = [
                            'id' => $modKey,
                            'name_bn' => ucfirst($modKey),
                            'icon' => '🧩',
                            'is_default' => true,
                            'is_required' => false,
                            'sort_order' => $index + 1
                        ];
                    }
                }

                return [
                    'id' => $template->id,
                    'category_id' => $template->category_id,
                    'name_bn' => $template->name,
                    'description' => $template->description,
                    'modules' => $templateModules,
                    'settings' => $template->config['settings'] ?? [],
                    'thumbnail' => $template->thumbnail,
                ];
            }),
            'logoLibrary' => [],
        ]);
    })->name('onboarding');

    Route::post('/onboarding/complete', function (Request $request) {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'business_phone' => 'required|string',
            'business_address' => 'nullable|string',
            'category_id' => 'required',
            'template_id' => 'required',
            'selected_modules' => 'nullable|array',
            'logo' => 'nullable',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        } elseif (is_string($validated['logo'])) {
            $logoPath = $validated['logo']; // Emoji or string path
        }

        $business = \App\Models\Business::create([
            'user_id' => auth()->id(),
            'name' => $validated['business_name'],
            'phone' => $validated['business_phone'],
            'address' => $validated['business_address'],
            'slug' => \App\Models\Business::generateSlug($validated['business_name']),
            'template_id' => $validated['template_id'],
            'onboarding_completed_at' => now(),
            'is_active' => true,
            'settings' => [
                'modules' => $validated['selected_modules'] ?? [],
            ],
            'logo' => $logoPath,
        ]);

        return redirect('/dashboard');
    })->name('onboarding.complete');
});

// Protected Routes (require authentication AND approval AND onboarding completion)
Route::middleware(['auth', EnsureUserIsApproved::class, EnsureOnboardingIsComplete::class])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/export', [DashboardController::class, 'exportSummary'])->name('dashboard.export');

    // Transactions
    Route::prefix('transactions')->name('transactions.')->group(function () {
        Route::get('/', [TransactionController::class, 'index'])->name('index');
        Route::post('/', [TransactionController::class, 'store'])->name('store');
    });

    // Parties (Customers & Suppliers)
    Route::resource('parties', \App\Http\Controllers\PartyController::class);

    // Products
    Route::resource('products', ProductController::class);

    // Invoices
    Route::resource('invoices', InvoiceController::class);

    // Returns
    Route::get('/returns/search', [ProductReturnController::class, 'search'])->name('returns.search');
    Route::resource('returns', ProductReturnController::class);

    // Dues (বাকি হিসাব)
    Route::prefix('dues')->name('dues.')->group(function () {
        Route::get('/', [\App\Http\Controllers\DueController::class, 'index'])->name('index');
        Route::post('/', [\App\Http\Controllers\DueController::class, 'store'])->name('store');
        Route::put('/{due}', [\App\Http\Controllers\DueController::class, 'update'])->name('update');
        Route::delete('/{due}', [\App\Http\Controllers\DueController::class, 'destroy'])->name('destroy');
        Route::post('/{due}/collect', [\App\Http\Controllers\DueController::class, 'collect'])->name('collect');
        Route::post('/party/{party}/collect', [\App\Http\Controllers\DueController::class, 'collectFromParty'])->name('collect-party');
        Route::get('/{due}/share', [\App\Http\Controllers\DueController::class, 'getShareMessage'])->name('share');
        Route::get('/party/{party}/share', [\App\Http\Controllers\DueController::class, 'getPartyShareMessage'])->name('share-party');
    });

    // Reports
    Route::prefix('reports')->name('reports.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Reports/Index');
        })->name('index');
    });

    // Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Settings/Index');
        })->name('index');
        
        // Business Settings (Premium Feature)
        Route::get('/business', [BusinessSettingsController::class, 'index'])->name('business');
        Route::put('/business', [BusinessSettingsController::class, 'update'])->name('business.update');
        Route::delete('/business/logo', [BusinessSettingsController::class, 'removeLogo'])->name('business.logo.remove');
        
        // Password Change
        Route::get('/password', function () {
            return Inertia::render('Settings/Password');
        })->name('password');
        Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
        
        // Recycle Bin
        Route::get('/recycle-bin', [\App\Http\Controllers\RecycleBinController::class, 'index'])->name('recycle-bin');
        Route::post('/recycle-bin/{type}/{id}/restore', [\App\Http\Controllers\RecycleBinController::class, 'restore'])->name('recycle-bin.restore');
        Route::delete('/recycle-bin/{type}/{id}', [\App\Http\Controllers\RecycleBinController::class, 'forceDelete'])->name('recycle-bin.force-delete');
        Route::delete('/recycle-bin', [\App\Http\Controllers\RecycleBinController::class, 'empty'])->name('recycle-bin.empty');
    });

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
        
        // Reset Password (Admin)
        Route::put('/{user}/reset-password', function (Request $request, User $user) {
            $validated = $request->validate([
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ], [
                'password.required' => 'নতুন পাসওয়ার্ড দিন।',
                'password.min' => 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে।',
                'password.confirmed' => 'পাসওয়ার্ড মিলছে না।',
            ]);
            
            $user->update([
                'password' => Hash::make($validated['password']),
            ]);
            
            return back()->with('success', 'পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে।');
        })->name('reset-password');
    });

    // Categories Management
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::post('/', [CategoryController::class, 'store'])->name('store');
        Route::put('/{category}', [CategoryController::class, 'update'])->name('update');
        Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('destroy');
        Route::post('/{category}/toggle-active', [CategoryController::class, 'toggleActive'])->name('toggle-active');
        Route::post('/update-order', [CategoryController::class, 'updateOrder'])->name('update-order');
    });

    // Templates Management
    Route::prefix('templates')->name('templates.')->group(function () {
        Route::get('/', [TemplateController::class, 'index'])->name('index');
        Route::get('/{template}', [TemplateController::class, 'show'])->name('show');
        Route::put('/{template}', [TemplateController::class, 'update'])->name('update');
        Route::post('/{template}/config', [TemplateController::class, 'updateConfig'])->name('update-config');
    });

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

    // Subscription Management
    Route::prefix('subscriptions')->name('subscriptions.')->group(function () {
        Route::get('/', [SubscriptionController::class, 'adminSubscriptions'])->name('index');
        Route::get('/plans', [SubscriptionController::class, 'adminPlans'])->name('plans');
        Route::put('/plans/{plan}', [SubscriptionController::class, 'adminUpdatePlan'])->name('plans.update');
        Route::post('/settings', [SubscriptionController::class, 'adminUpdateSettings'])->name('settings.update');
        
        // Business subscription management
        Route::post('/business/{business}/extend', [SubscriptionController::class, 'adminExtendSubscription'])->name('business.extend');
        Route::post('/business/{business}/unlimited', [SubscriptionController::class, 'adminSetUnlimited'])->name('business.unlimited');
        Route::post('/business/{business}/revoke', [SubscriptionController::class, 'adminRevokeSubscription'])->name('business.revoke');
        Route::post('/business/{business}/assign', [SubscriptionController::class, 'adminAssignPlan'])->name('business.assign');
    });
});
