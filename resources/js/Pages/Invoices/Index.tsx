import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, Invoice } from '@/types';

interface InvoicesProps extends PageProps {
    invoices?: Invoice[];
}

export default function Invoices({ auth, invoices = [] }: InvoicesProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid'>('all');

    // Use real invoices or empty array
    const invoicesList = 'data' in invoices ? (invoices as any).data : invoices;

    const formatTaka = (amount: number) => '৳ ' + Number(amount || 0).toLocaleString('bn-BD');

    const filteredInvoices = invoicesList.filter((inv: Invoice) => {
        if (activeTab === 'pending') return inv.status === 'unpaid' || inv.status === 'partial';
        if (activeTab === 'paid') return inv.status === 'paid';
        return true;
    });

    const totalAmount = invoicesList.reduce((sum: number, inv: Invoice) => sum + Number(inv.total_amount || 0), 0);
    const totalPaid = invoicesList.reduce((sum: number, inv: Invoice) => sum + Number(inv.paid_amount || 0), 0);
    const totalDue = invoicesList.reduce((sum: number, inv: Invoice) => sum + Number(inv.due_amount || 0), 0);



    return (
        <DashboardLayout title="বিল/চালান">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">বিল/চালান</h1>
                    <p className="text-gray-400">সকল বিল দেখুন ও নতুন বিল তৈরি করুন</p>
                </div>
                <Link
                    href="/invoices/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium"
                    style={{ backgroundColor: '#006A4E' }}
                >
                    <span>➕</span>
                    <span>নতুন বিল</span>
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">মোট বিল</p>
                    <p className="text-2xl font-bold text-white">{formatTaka(totalAmount)}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">আদায়</p>
                    <p className="text-2xl font-bold text-green-400">{formatTaka(totalPaid)}</p>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                    <p className="text-gray-400 text-sm">বাকি</p>
                    <p className="text-2xl font-bold text-red-400">{formatTaka(totalDue)}</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {[
                    { key: 'all', label: 'সব' },
                    { key: 'pending', label: 'বাকি আছে' },
                    { key: 'paid', label: 'পরিশোধিত' },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.key
                            ? 'text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        style={activeTab === tab.key ? { backgroundColor: '#006A4E' } : {}}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Invoices List */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700">
                <div className="divide-y divide-gray-700">
                    {filteredInvoices.map((invoice: any) => (
                        <div
                            key={invoice.id}
                            className="flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors"
                        >
                            <Link
                                href={`/invoices/${invoice.id}`}
                                className="flex items-center gap-4 flex-1"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${invoice.status === 'paid' ? 'bg-green-500/20' :
                                    invoice.status === 'partial' ? 'bg-yellow-500/20' : 'bg-red-500/20'
                                    }`}>
                                    🧾
                                </div>
                                <div>
                                    <p className="font-medium text-white">{invoice.invoice_number}</p>
                                    <p className="text-sm text-gray-400">
                                        {invoice.party?.name || 'সাধারণ কাস্টমার'} • {new Date(invoice.date).toLocaleDateString('bn-BD')}
                                    </p>
                                </div>
                            </Link>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="font-bold text-white">{formatTaka(invoice.total_amount)}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                                        invoice.status === 'partial' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        {invoice.status === 'paid' ? 'পরিশোধিত' :
                                            invoice.status === 'partial' ? `বাকি ${formatTaka(invoice.due_amount)}` : 'বাকি'}
                                    </span>
                                </div>
                                <Link
                                    href={`/invoices/${invoice.id}`}
                                    className="p-2 rounded-lg bg-teal-600/20 text-teal-400 hover:bg-teal-600/40 transition-colors"
                                    title="বিস্তারিত দেখুন / প্রিন্ট"
                                >
                                    🖨️
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
