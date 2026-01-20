<?php

namespace App\Http\Controllers;

use App\Models\CloudinaryAccount;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CloudinaryAccountController extends Controller
{
    /**
     * Display a listing of Cloudinary accounts
     */
    public function index()
    {
        $accounts = CloudinaryAccount::orderBy('created_at', 'desc')->get()->map(function ($account) {
            // Mask API key for display (show first 4 and last 4 characters)
            $apiKey = $account->api_key;
            $maskedKey = strlen($apiKey) > 8 
                ? substr($apiKey, 0, 4) . '****' . substr($apiKey, -4) 
                : '****';
            
            return [
                'id' => $account->id,
                'name' => $account->name,
                'cloud_name' => $account->cloud_name,
                'api_key_masked' => $maskedKey,
                'is_active' => $account->is_active,
                'created_at' => $account->created_at->format('Y-m-d H:i'),
            ];
        });

        return Inertia::render('Admin/Cloudinary/Index', [
            'accounts' => $accounts,
        ]);
    }

    /**
     * Store a new Cloudinary account
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'cloud_name' => ['required', 'string', 'max:255'],
            'api_key' => ['required', 'string'],
            'api_secret' => ['required', 'string'],
        ], [
            'name.required' => 'অ্যাকাউন্টের নাম দিন।',
            'cloud_name.required' => 'Cloud Name দিন।',
            'api_key.required' => 'API Key দিন।',
            'api_secret.required' => 'API Secret দিন।',
        ]);

        // If this is the first account, make it active
        $isFirstAccount = CloudinaryAccount::count() === 0;

        $account = CloudinaryAccount::create([
            'name' => $validated['name'],
            'cloud_name' => $validated['cloud_name'],
            'api_key' => $validated['api_key'],
            'api_secret' => $validated['api_secret'],
            'is_active' => $isFirstAccount,
        ]);

        return back()->with('success', 'Cloudinary অ্যাকাউন্ট সফলভাবে যোগ হয়েছে।');
    }

    /**
     * Update the specified Cloudinary account
     */
    public function update(Request $request, CloudinaryAccount $cloudinary)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'cloud_name' => ['required', 'string', 'max:255'],
            'api_key' => ['nullable', 'string'],
            'api_secret' => ['nullable', 'string'],
        ]);

        $updateData = [
            'name' => $validated['name'],
            'cloud_name' => $validated['cloud_name'],
        ];

        // Only update credentials if provided
        if (!empty($validated['api_key'])) {
            $updateData['api_key'] = $validated['api_key'];
        }
        if (!empty($validated['api_secret'])) {
            $updateData['api_secret'] = $validated['api_secret'];
        }

        $cloudinary->update($updateData);

        return back()->with('success', 'Cloudinary অ্যাকাউন্ট আপডেট হয়েছে।');
    }

    /**
     * Delete the specified Cloudinary account
     */
    public function destroy(CloudinaryAccount $cloudinary)
    {
        if ($cloudinary->is_active) {
            return back()->with('error', 'সক্রিয় অ্যাকাউন্ট মুছে ফেলা যাবে না। আগে অন্য অ্যাকাউন্ট সক্রিয় করুন।');
        }

        $cloudinary->delete();

        return back()->with('success', 'Cloudinary অ্যাকাউন্ট মুছে ফেলা হয়েছে।');
    }

    /**
     * Activate the specified Cloudinary account
     */
    public function activate(CloudinaryAccount $cloudinary)
    {
        $cloudinary->activate();

        return back()->with('success', "'{$cloudinary->name}' অ্যাকাউন্ট সক্রিয় করা হয়েছে।");
    }

    /**
     * Test connection to Cloudinary
     */
    public function testConnection(Request $request)
    {
        $validated = $request->validate([
            'cloud_name' => ['required', 'string'],
            'api_key' => ['required', 'string'],
            'api_secret' => ['required', 'string'],
        ]);

        $service = new CloudinaryService();
        $result = $service->testConnection(
            $validated['cloud_name'],
            $validated['api_key'],
            $validated['api_secret']
        );

        if ($result['success']) {
            return response()->json([
                'success' => true,
                'message' => 'সংযোগ সফল! ✅',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'সংযোগ ব্যর্থ: ' . $result['message'],
        ], 400);
    }
}
