<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BusinessSettingsController extends Controller
{
    /**
     * Show the business settings page
     */
    public function index()
    {
        $business = auth()->user()->business;
        
        if (!$business) {
            return redirect()->route('onboarding');
        }

        return Inertia::render('Settings/Business', [
            'business' => $business->load('template.category'),
        ]);
    }

    /**
     * Update business information
     */
    public function update(Request $request)
    {
        $business = auth()->user()->business;
        
        if (!$business) {
            return redirect()->route('onboarding');
        }

        // Check if user has premium or trial subscription
        if (!$business->isPremium() && !$business->isInTrial()) {
            return back()->with('error', 'এই ফিচার শুধুমাত্র প্রিমিয়াম/ট্রায়াল ইউজারদের জন্য।');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'logo' => 'nullable|image|max:2048', // 2MB max
        ], [
            'name.required' => 'ব্যবসার নাম দিতে হবে।',
            'name.max' => 'ব্যবসার নাম ২৫৫ অক্ষরের বেশি হতে পারবে না।',
            'phone.max' => 'ফোন নম্বর ২০ অক্ষরের বেশি হতে পারবে না।',
            'address.max' => 'ঠিকানা ৫০০ অক্ষরের বেশি হতে পারবে না।',
            'logo.image' => 'লোগো অবশ্যই একটি ছবি হতে হবে।',
            'logo.max' => 'লোগোর সাইজ ২MB এর বেশি হতে পারবে না।',
        ]);

        // Handle logo upload via Cloudinary
        if ($request->hasFile('logo')) {
            $cloudinary = new \App\Services\CloudinaryService();
            
            // Check if Cloudinary is configured
            if (!$cloudinary->hasActiveAccount()) {
                return back()->with('error', 'Cloudinary কনফিগার করা হয়নি। অ্যাডমিনের সাথে যোগাযোগ করুন।');
            }
            
            try {
                // Delete old logo from Cloudinary if it's a Cloudinary URL
                if ($business->logo && str_contains($business->logo, 'cloudinary.com')) {
                    // Extract public_id from URL
                    if (preg_match('/\/v\d+\/(.+?)\.[a-z]+$/i', $business->logo, $matches)) {
                        $oldPublicId = $matches[1];
                        $cloudinary->delete($oldPublicId);
                    }
                }
                
                // Upload to Cloudinary
                $result = $cloudinary->upload($request->file('logo'), 'business-logos');
                $validated['logo'] = $result['secure_url'];
            } catch (\Exception $e) {
                return back()->with('error', 'লোগো আপলোড করতে সমস্যা হয়েছে: ' . $e->getMessage());
            }
        }

        // Update business
        $business->update([
            'name' => $validated['name'],
            'phone' => $validated['phone'] ?? $business->phone,
            'address' => $validated['address'] ?? $business->address,
            'logo' => $validated['logo'] ?? $business->logo,
        ]);

        return back()->with('success', 'ব্যবসার তথ্য সফলভাবে আপডেট হয়েছে!');
    }

    /**
     * Remove business logo
     */
    public function removeLogo()
    {
        $business = auth()->user()->business;
        
        if (!$business) {
            return redirect()->route('onboarding');
        }

        if (!$business->isPremium() && !$business->isInTrial()) {
            return back()->with('error', 'এই ফিচার শুধুমাত্র প্রিমিয়াম/ট্রায়াল ইউজারদের জন্য।');
        }

        // Delete logo file from Cloudinary
        if ($business->logo && str_contains($business->logo, 'cloudinary.com')) {
            try {
                $cloudinary = new \App\Services\CloudinaryService();
                if ($cloudinary->hasActiveAccount()) {
                    // Extract public_id from URL
                    if (preg_match('/\/v\d+\/(.+?)\.[a-z]+$/i', $business->logo, $matches)) {
                        $cloudinary->delete($matches[1]);
                    }
                }
            } catch (\Exception $e) {
                // Silent fail - logo will be removed from DB anyway
            }
        }

        $business->update(['logo' => null]);

        return back()->with('success', 'লোগো মুছে ফেলা হয়েছে।');
    }
}
