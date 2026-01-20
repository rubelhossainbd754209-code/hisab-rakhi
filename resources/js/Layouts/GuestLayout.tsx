import React from 'react';
import { Head } from '@inertiajs/react';

interface GuestLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function GuestLayout({ children, title }: GuestLayoutProps) {
    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
                {/* Header */}
                <header className="py-6 px-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <a href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                                <span className="text-white text-xl font-bold">হি</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                হিসাব করি
                            </span>
                        </a>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 flex items-center justify-center px-4 py-12">
                    {children}
                </main>

                {/* Footer */}
                <footer className="py-6 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} হিসাব করি। সর্বস্বত্ব সংরক্ষিত।</p>
                </footer>
            </div>
        </>
    );
}
