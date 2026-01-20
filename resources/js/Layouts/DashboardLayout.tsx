import React, { useState, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import type { PageProps } from '@/types';
import MenuCustomizer from '@/Components/Dashboard/MenuCustomizer';
import AddTransactionModal from '@/Components/Modals/AddTransactionModal';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
}

// Default menu items configuration
const defaultMenuItems = [
    { id: 'dashboard', name: 'ড্যাশবোর্ড', icon: '🏠', href: '/dashboard', isVisible: true, order: 0 },
    { id: 'transactions', name: 'দৈনিক হিসাব', icon: '📅', href: '/transactions', isVisible: true, order: 1 },
    { id: 'parties', name: 'পার্টি', icon: '👥', href: '/parties', isVisible: true, order: 2 },
    { id: 'products', name: 'পণ্য সমূহ', icon: '📦', href: '/products', isVisible: true, order: 3 },
    { id: 'invoices', name: 'বিল/চালান', icon: '🧾', href: '/invoices', isVisible: true, order: 4 },
    { id: 'reports', name: 'রিপোর্ট', icon: '📊', href: '/reports', isVisible: true, order: 5 },
    { id: 'settings', name: 'সেটিংস', icon: '⚙️', href: '/settings', isVisible: true, order: 6 },
];

interface MenuItem {
    id: string;
    name: string;
    customName?: string;
    icon: string;
    href: string;
    isVisible: boolean;
    order: number;
}

interface ExtendedPageProps extends PageProps {
    menuConfig?: MenuItem[];
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
    const { auth, menuConfig } = usePage<ExtendedPageProps>().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMenuCustomizerOpen, setIsMenuCustomizerOpen] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);

    // Load menu items from config or localStorage or defaults
    const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
        if (menuConfig) return menuConfig;
        const saved = typeof window !== 'undefined' ? localStorage.getItem('hisab_menu_config') : null;
        return saved ? JSON.parse(saved) : defaultMenuItems;
    });

    // Get current path
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    // Filter visible and sorted menu items
    const visibleMenuItems = menuItems
        .filter(item => item.isVisible)
        .sort((a, b) => a.order - b.order);

    // Handle menu save
    const handleMenuSave = (items: MenuItem[]) => {
        setMenuItems(items);
        // Save to localStorage for now
        if (typeof window !== 'undefined') {
            localStorage.setItem('hisab_menu_config', JSON.stringify(items));
        }
        // TODO: Save to backend
    };

    return (
        <>
            <Head title={title} />

            {/* Add Transaction Modal */}
            <AddTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
            />

            {/* Menu Customizer Modal */}
            <MenuCustomizer
                isOpen={isMenuCustomizerOpen}
                onClose={() => setIsMenuCustomizerOpen(false)}
                items={menuItems}
                onSave={handleMenuSave}
            />

            <div className="min-h-screen bg-gray-900">
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
                        fixed top-0 left-0 z-50 h-full w-72 bg-gray-800
                        transform transition-transform duration-300 ease-in-out
                        lg:translate-x-0 shadow-xl
                        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    {/* Logo */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-gray-700">
                        <Link href="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#006A4E' }}>
                                <span className="text-white text-xl font-bold">হি</span>
                            </div>
                            <span className="text-lg font-bold text-white">
                                হিসাব করি
                            </span>
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-700 text-gray-400"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Business Info */}
                    {auth.business && (
                        <div className="p-4 m-4 bg-gray-700/50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg" style={{ backgroundColor: '#006A4E' }}>
                                    {auth.business.logo ? (
                                        <img src={auth.business.logo} alt="" className="w-full h-full object-cover rounded-xl" />
                                    ) : (
                                        auth.business.name.charAt(0)
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white truncate">
                                        {auth.business.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {auth.business.category?.name_bn}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="p-4 space-y-1">
                        {visibleMenuItems.map((item) => {
                            const isActive = currentPath === item.href ||
                                (item.href !== '/dashboard' && currentPath.startsWith(item.href));
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors
                                        ${isActive
                                            ? 'text-white'
                                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                        }
                                    `}
                                    style={isActive ? { backgroundColor: '#006A4E' } : {}}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.customName || item.name}</span>
                                </Link>
                            );
                        })}

                        {/* Customize Menu Button */}
                        <button
                            onClick={() => setIsMenuCustomizerOpen(true)}
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:bg-gray-700 hover:text-gray-300 transition-colors w-full mt-4 border border-dashed border-gray-700"
                        >
                            <span className="text-xl">✏️</span>
                            <span className="text-sm">মেনু কাস্টমাইজ</span>
                        </button>
                    </nav>

                    {/* Quick Add Button */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                        <button
                            onClick={() => setIsTransactionModalOpen(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-white font-medium transition-colors hover:opacity-90"
                            style={{ backgroundColor: '#006A4E' }}
                        >
                            <span className="text-lg">➕</span>
                            <span>নতুন লেনদেন</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="lg:pl-72">
                    {/* Top Header */}
                    <header className="sticky top-0 z-30 h-16 bg-gray-800/95 backdrop-blur-lg border-b border-gray-700">
                        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-gray-700 text-gray-400"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            {/* Search Bar */}
                            <div className="hidden md:flex flex-1 max-w-md mx-4">
                                <div className="relative w-full">
                                    <input
                                        type="text"
                                        placeholder="খুঁজুন..."
                                        className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-700 border-0 focus:ring-2 text-white placeholder-gray-400"
                                        style={{ '--tw-ring-color': '#006A4E' } as React.CSSProperties}
                                    />
                                    <svg
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Right Side Actions */}
                            <div className="flex items-center gap-3">
                                {/* Quick Add - Desktop */}
                                <button
                                    onClick={() => setIsTransactionModalOpen(true)}
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium"
                                    style={{ backgroundColor: '#006A4E' }}
                                >
                                    <span>➕</span>
                                    <span>নতুন</span>
                                </button>

                                {/* Notifications */}
                                <button className="p-2 rounded-lg hover:bg-gray-700 relative text-gray-400">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>

                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-700"
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: '#006A4E' }}>
                                            {auth.user?.name?.charAt(0) || 'U'}
                                        </div>
                                        <span className="hidden sm:block text-sm font-medium text-white">
                                            {auth.user?.name}
                                        </span>
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-xl py-2 animate-fade-in border border-gray-700">
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                            >
                                                প্রোফাইল
                                            </Link>
                                            <Link
                                                href="/settings"
                                                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                            >
                                                সেটিংস
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
