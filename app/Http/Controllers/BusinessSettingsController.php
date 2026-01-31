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

        // Check if user has premium subscription
        if (!$business->isPremium()) {
            return back()->with('error', 'এই ফিচার শুধুমাত্র প্রিমিয়াম ইউজারদের জন্য।');
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

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($business->logo && !str_starts_with($business->logo, 'http')) {
                Storage::disk('public')->delete($business->logo);
            }

            // Store new logo
            $logoPath = $request->file('logo')->store('business-logos', 'public');
            $validated['logo'] = $logoPath;
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

        if (!$business->isPremium()) {
            return back()->with('error', 'এই ফিচার শুধুমাত্র প্রিমিয়াম ইউজারদের জন্য।');
        }

        // Delete logo file
        if ($business->logo && !str_starts_with($business->logo, 'http')) {
            Storage::disk('public')->delete($business->logo);
        }

        $business->update(['logo' => null]);

        return back()->with('success', 'লোগো মুছে ফেলা হয়েছে।');
    }
}
