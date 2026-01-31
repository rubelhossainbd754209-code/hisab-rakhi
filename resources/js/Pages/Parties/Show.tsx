import { Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, Party, Invoice } from '@/types';

interface ShowProps extends PageProps {
    party: Party;
    invoices: Invoice[];
    stats?: {
        total_purchases: number;
        total_amount: number;
        total_paid: number;
        total_due: number;
        total_returns: number;
        return_amount: number;
        first_purchase_date: string | null;
        last_purchase_date: string | null;
        invoice_count: number;
    };
}

export default function PartyShow({ party, invoices, stats }: ShowProps) {
    const formatTaka = (amount: number) => '৳' + Number(amount || 0).toLocaleString('bn-BD');
    const formatDate = (date: string | null) => {
        if (!date) return 'নেই';
        return new Date(date).toLocaleDateString('bn-BD', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Calculate customer since
    const customerSince = party.created_at ? formatDate(party.created_at) : 'নেই';

    // Use passed stats or calculate defaults
    const totalPurchases = stats?.invoice_count || invoices.length;
    const totalAmount = stats?.total_amount || invoices.reduce((sum: number, inv: any) => sum + Number(inv.total_amount || 0), 0);
    const totalPaid = stats?.total_paid || invoices.reduce((sum: number, inv: any) => sum + Number(inv.paid_amount || 0), 0);
    const totalDue = stats?.total_due || invoices.reduce((sum: number, inv: any) => sum + Number(inv.due_amount || 0), 0);

    return (
        <DashboardLayout title={party.name}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link href="/parties" className="text-gray-400 hover:text-white mb-2 inline-block">
                        ← গ্রাহক তালিকায় ফিরে যান
                    </Link>
                </div>

                {/* Customer Profile Card */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {/* Avatar */}
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl text-white font-bold ${party.type === 'customer' ? 'bg-blue-600' :
                                party.type === 'supplier' ? 'bg-purple-600' : 'bg-teal-600'
                            }`}>
                            {party.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl font-bold text-white">{party.name}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${party.type === 'customer'
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        : party.type === 'supplier'
                                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                            : 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                                    }`}>
                                    {party.type === 'customer' ? '👤 গ্রাহক' :
                                        party.type === 'supplier' ? '🏭 সাপ্লায়ার' : '🔄 উভয়'}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-gray-400">
                                {party.phone && (
                                    <span className="flex items-center gap-1">
                                        📱 {party.phone}
                                    </span>
                                )}
                                {party.email && (
                                    <span className="flex items-center gap-1">
                                        ✉️ {party.email}
                                    </span>
                                )}
                                {party.address && (
                                    <span className="flex items-center gap-1">
                                        📍 {party.address}
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-500 text-sm mt-2">
                                গ্রাহক হয়েছেন: {customerSince}
                            </p>
                        </div>

                        {/* Current Balance */}
                        <div className="text-right">
                            <p className="text-gray-400 text-sm">বর্তমান ব্যালেন্স</p>
                            <p className={`text-3xl font-bold ${Number(party.balance) > 0 ? 'text-green-400' :
                                    Number(party.balance) < 0 ? 'text-red-400' : 'text-gray-400'
                                }`}>
                                {Number(party.balance) > 0 ? 'পাবেন ' :
                                    Number(party.balance) < 0 ? 'দিবেন ' : ''}
                                {formatTaka(Math.abs(Number(party.balance)))}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center text-xl">
                                🛒
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">মোট ক্রয়</p>
                                <p className="text-xl font-bold text-white">{totalPurchases} বার</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-xl">
                                💰
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">মোট কেনাকাটা</p>
                                <p className="text-xl font-bold text-green-400">{formatTaka(totalAmount)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center text-xl">
                                ✅
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">পরিশোধ করেছেন</p>
                                <p className="text-xl font-bold text-teal-400">{formatTaka(totalPaid)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-xl">
                                ⏳
                            </div>
                            <div>
                                <p className="text-gray-400 text-xs">বাকি আছে</p>
                                <p className="text-xl font-bold text-red-400">{formatTaka(totalDue)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                        <p className="text-gray-400 text-sm mb-1">📅 প্রথম ক্রয়</p>
                        <p className="text-white font-medium">
                            {stats?.first_purchase_date ? formatDate(stats.first_purchase_date) :
                                invoices.length > 0 ? formatDate((invoices[invoices.length - 1] as any)?.date) : 'নেই'}
                        </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                        <p className="text-gray-400 text-sm mb-1">📅 সর্বশেষ ক্রয়</p>
                        <p className="text-white font-medium">
                            {stats?.last_purchase_date ? formatDate(stats.last_purchase_date) :
                                invoices.length > 0 ? formatDate((invoices[0] as any)?.date) : 'নেই'}
                        </p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                        <p className="text-gray-400 text-sm mb-1">🔄 রিটার্ন করেছেন</p>
                        <p className="text-white font-medium">
                            {stats?.total_returns || 0} টি পণ্য
                            {stats?.return_amount ? ` (${formatTaka(stats.return_amount)})` : ''}
                        </p>
                    </div>
                </div>

                {/* Recent Invoices */}
                <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-white">📋 সাম্প্রতিক বিল সমূহ</h2>
                    </div>

                    {invoices.length > 0 ? (
                        <div className="divide-y divide-gray-700">
                            {invoices.map((invoice: any) => (
                                <Link
                                    key={invoice.id}
                                    href={`/invoices/${invoice.id}`}
                                    className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${invoice.status === 'paid' ? 'bg-green-500/20' :
                                                invoice.status === 'partial' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                                            }`}>
                                            🧾
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">{invoice.invoice_number}</p>
                                            <p className="text-sm text-gray-400">
                                                {formatDate(invoice.date)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white">{formatTaka(invoice.total_amount)}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                                invoice.status === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {invoice.status === 'paid' ? 'পরিশোধিত' :
                                                invoice.status === 'partial' ? `বাকি ${formatTaka(invoice.due_amount)}` : 'বাকি'}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="text-4xl mb-3">📭</div>
                            <p className="text-gray-400">কোনো বিল পাওয়া যায়নি</p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 mt-6">
                    <Link
                        href={`/parties/${party.id}/edit`}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-700 text-white font-medium hover:bg-gray-600 transition-all"
                    >
                        ✏️ এডিট করুন
                    </Link>
                    <Link
                        href="/invoices/create"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold hover:from-teal-500 hover:to-teal-400 shadow-lg transition-all"
                    >
                        ➕ নতুন বিল করুন
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
