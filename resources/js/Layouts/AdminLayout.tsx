import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

// Admin navigation items
const adminNavItems = [
    { name: 'ড্যাশবোর্ড', href: '/admin', icon: '🏠' },
    { name: 'ব্যবহারকারী', href: '/admin/users', icon: '👥' },
    { name: 'ব্যবসা সমূহ', href: '/admin/businesses', icon: '🏪' },
    { name: 'ক্যাটাগরি', href: '/admin/categories', icon: '📁' },
    { name: 'টেমপ্লেট', href: '/admin/templates', icon: '🎨' },
    { name: 'Cloudinary', href: '/admin/cloudinary', icon: '☁️' },
    { name: 'সেটিংস', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { auth } = usePage<PageProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <>
            <Head title={`${title} - অ্যাডমিন`} />
            <div className="min-h-screen bg-gray-950">
                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside
                    className={`
                        fixed top-0 left-0 z-50 h-full w-64 bg-gray-900 border-r border-gray-800
                        transform transition-transform duration-300 ease-in-out
                        lg:translate-x-0
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                        <Link href="/admin" className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center">
                                <span className="text-white text-sm font-bold">এ</span>
                            </div>
                            <div>
                                <span className="text-white font-semibold block leading-none">হিসাব করি</span>
                                <span className="text-red-400 text-xs">সুপার অ্যাডমিন</span>
                            </div>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-400"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-3 space-y-1">
                        {adminNavItems.map((item) => {
                            const isActive = currentPath === item.href ||
                                (item.href !== '/admin' && currentPath.startsWith(item.href));
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm
                                        ${isActive
                                            ? 'bg-red-500 text-white'
                                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                        }
                                    `}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Go to Customer Dashboard */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-800">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors text-sm"
                        >
                            <span className="text-lg">🔙</span>
                            <span>কাস্টমার ড্যাশবোর্ড</span>
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="lg:pl-64">
                    {/* Top Header */}
                    <header className="sticky top-0 z-30 h-14 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
                        <div className="h-full px-4 flex items-center justify-between">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-400"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            {/* Page Title */}
                            <h1 className="text-lg font-semibold text-white hidden lg:block">{title}</h1>

                            {/* Right Side */}
                            <div className="flex items-center gap-3">
                                {/* Notifications */}
                                <button className="p-2 rounded-lg hover:bg-gray-800 relative text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-800"
                                    >
                                        <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-sm font-semibold">
                                            {auth.user?.name?.charAt(0) || 'A'}
                                        </div>
                                        <span className="hidden sm:block text-sm text-white">
                                            {auth.user?.name}
                                        </span>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2 border border-gray-700">
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                            >
                                                প্রোফাইল
                                            </Link>
                                            <hr className="my-2 border-gray-700" />
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
                                            >
                                                লগআউট
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="p-4 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
