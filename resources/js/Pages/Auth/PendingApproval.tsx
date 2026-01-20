import React from 'react';
import { Head, Link } from '@inertiajs/react';

interface PendingApprovalProps {
    user: {
        name: string;
        email: string;
        is_approved: boolean;
        is_active: boolean;
    };
}

export default function PendingApproval({ user }: PendingApprovalProps) {
    return (
        <>
            <Head title="অনুমোদন প্রত্যাশায়" />
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    {/* Icon */}
                    <div className="w-24 h-24 mx-auto mb-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                        <span className="text-5xl">⏳</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-white mb-2">
                        অনুমোদন প্রত্যাশায়
                    </h1>

                    {/* Message */}
                    <p className="text-gray-400 mb-6">
                        {!user.is_active ? (
                            <>
                                আপনার অ্যাকাউন্ট বর্তমানে নিষ্ক্রিয়। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।
                            </>
                        ) : (
                            <>
                                প্রিয় <span className="text-white font-medium">{user.name}</span>,
                                <br />
                                আপনার অ্যাকাউন্ট রিভিউ করা হচ্ছে। অ্যাডমিন অনুমোদন দিলে আপনি ড্যাশবোর্ড ব্যবহার করতে পারবেন।
                            </>
                        )}
                    </p>

                    {/* Status Card */}
                    <div className="bg-gray-800 rounded-xl p-4 mb-6 border border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-gray-400">ইমেইল</span>
                            <span className="text-white">{user.email}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">স্ট্যাটাস</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${!user.is_active
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                {!user.is_active ? 'নিষ্ক্রিয়' : 'অপেক্ষমান'}
                            </span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="bg-blue-500/10 rounded-xl p-4 mb-6 text-left">
                        <p className="text-blue-400 text-sm">
                            💡 সাধারণত ২৪ ঘণ্টার মধ্যে অনুমোদন দেওয়া হয়। জরুরি প্রয়োজনে অ্যাডমিনের সাথে যোগাযোগ করুন।
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex-1 px-4 py-3 rounded-xl bg-gray-700 text-gray-300 font-medium hover:bg-gray-600 transition-colors"
                        >
                            লগআউট
                        </Link>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex-1 px-4 py-3 rounded-xl text-white font-medium transition-colors"
                            style={{ backgroundColor: '#006A4E' }}
                        >
                            রিফ্রেশ করুন
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
