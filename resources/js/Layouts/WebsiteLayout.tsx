import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';

interface WebsiteLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function WebsiteLayout({ children, title }: WebsiteLayoutProps) {
    const { url } = usePage();
    const isHomePage = url === '/';

    const scrollOrNavigate = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
        if (!isHomePage) {
            // Let the default behavior handle navigation to /#hash
            return;
        }

        e.preventDefault();
        const element = document.querySelector(hash);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {title && <Head title={title} />}
            <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                                    <span className="text-white text-xl font-bold">হি</span>
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    হিসাব রাখি
                                </span>
                            </Link>

                            {/* Navigation */}
                            <nav className="hidden md:flex items-center gap-8">
                                <a
                                    href="/#features"
                                    onClick={(e) => scrollOrNavigate(e, '#features')}
                                    className="text-gray-600 hover:text-primary-500 dark:text-gray-300 transition-colors"
                                >
                                    বৈশিষ্ট্য
                                </a>
                                <a
                                    href="/#business-types"
                                    onClick={(e) => scrollOrNavigate(e, '#business-types')}
                                    className="text-gray-600 hover:text-primary-500 dark:text-gray-300 transition-colors"
                                >
                                    ব্যবসার ধরন
                                </a>
                                <Link
                                    href="/pricing"
                                    className={`text-gray-600 hover:text-primary-500 dark:text-gray-300 transition-colors ${url.startsWith('/pricing') ? 'text-primary-500 font-medium' : ''}`}
                                >
                                    মূল্য
                                </Link>
                            </nav>

                            {/* Auth Buttons */}
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-gray-600 hover:text-primary-500 dark:text-gray-300 transition-colors"
                                >
                                    লগইন
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-primary-500/30"
                                >
                                    ফ্রি শুরু করুন
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    {children}
                </main>

                {/* Footer */}
                <footer className="bg-gray-900 text-gray-400 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                                    <span className="text-white text-xl font-bold">হি</span>
                                </div>
                                <span className="text-lg font-bold text-white">হিসাব রাখি</span>
                            </div>
                            <p className="text-sm">
                                © {new Date().getFullYear()} হিসাব রাখি। সর্বস্বত্ব সংরক্ষিত।
                            </p>
                            <div className="flex items-center gap-6">
                                <a href="#" className="hover:text-white transition-colors">গোপনীয়তা নীতি</a>
                                <a href="#" className="hover:text-white transition-colors">শর্তাবলী</a>
                                <a href="#" className="hover:text-white transition-colors">যোগাযোগ</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
