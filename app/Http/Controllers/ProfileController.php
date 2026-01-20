<?php

namespace App\Http\Controllers;

use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the user's profile
     */
    public function index()
    {
        return Inertia::render('Profile/Index', [
            'user' => Auth::user(),
        ]);
    }

    /**
     * Update the user's profile information
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
        ], [
            'name.required' => 'নাম দিন।',
        ]);

        $user->update($validated);

        return back()->with('success', 'প্রোফাইল আপডেট হয়েছে।');
    }

    /**
     * Update the user's profile image
     */
    public function updateImage(Request $request)
    {
        $request->validate([
            'image' => ['required', 'image', 'max:5120'], // 5MB max
        ], [
            'image.required' => 'ছবি সিলেক্ট করুন।',
            'image.image' => 'সঠিক ছবি আপলোড করুন।',
            'image.max' => 'ছবির সাইজ ৫MB এর বেশি হতে পারবে না।',
        ]);

        $cloudinary = new CloudinaryService();

        // Check if Cloudinary is configured
        if (!$cloudinary->hasActiveAccount()) {
            return back()->with('error', 'Cloudinary কনফিগার করা হয়নি।');
        }

        try {
            // Upload to Cloudinary
            $result = $cloudinary->upload($request->file('image'), 'profile-images');
            
            $user = Auth::user();
            
            // Delete old image if exists
            if ($user->profile_image) {
                // Extract public_id from URL and delete
                $oldPublicId = $this->extractPublicId($user->profile_image);
                if ($oldPublicId) {
                    $cloudinary->delete($oldPublicId);
                }
            }

            // Save new image URL
            $user->update([
                'profile_image' => $result['secure_url'],
            ]);

            return back()->with('success', 'প্রোফাইল ছবি আপডেট হয়েছে।');
        } catch (\Exception $e) {
            return back()->with('error', 'ছবি আপলোড ব্যর্থ: ' . $e->getMessage());
        }
    }

    /**
     * Remove the user's profile image
     */
    public function removeImage()
    {
        $user = Auth::user();
        
        if ($user->profile_image) {
            $cloudinary = new CloudinaryService();
            
            // Try to delete from Cloudinary
            $publicId = $this->extractPublicId($user->profile_image);
            if ($publicId && $cloudinary->hasActiveAccount()) {
                $cloudinary->delete($publicId);
            }

            $user->update(['profile_image' => null]);
        }

        return back()->with('success', 'প্রোফাইল ছবি মুছে ফেলা হয়েছে।');
    }

    /**
     * Update the user's password
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'current_password.required' => 'বর্তমান পাসওয়ার্ড দিন।',
            'password.required' => 'নতুন পাসওয়ার্ড দিন।',
            'password.min' => 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষর হতে হবে।',
            'password.confirmed' => 'পাসওয়ার্ড মিলছে না।',
        ]);

        $user = Auth::user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'বর্তমান পাসওয়ার্ড সঠিক নয়।']);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'পাসওয়ার্ড পরিবর্তন হয়েছে।');
    }

    /**
     * Extract public_id from Cloudinary URL
     */
    private function extractPublicId(string $url): ?string
    {
        // Example URL: https://res.cloudinary.com/cloud-name/image/upload/v123/folder/filename.jpg
        if (preg_match('/\/upload\/(?:v\d+\/)?(.+)\.\w+$/', $url, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
