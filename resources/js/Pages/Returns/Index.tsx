import React from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps } from '@/types';

interface ReturnsProps extends PageProps {
    returns: {
        data: any[];
        links: any[]; // Simplification
    };
}

export default function ReturnsIndex({ auth, returns }: ReturnsProps) {
    const formatTaka = (amount: number) => '৳ ' + amount.toLocaleString('bn-BD');

    return (
        <DashboardLayout title="রিটার্ন তালিকা">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">রিটার্ন তালিকা (Return History)</h1>
                    <p className="text-gray-400">সকল ফেরত পণ্যের তালিকা</p>
                </div>
                <Link
                    href="/returns/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-medium"
                    style={{ backgroundColor: '#006A4E' }}
                >
                    <span>🔄</span>
                    <span>নতুন রিটার্ন</span>
                </Link>
            </div>

            <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-gray-300">
                        <thead className="bg-gray-900/50 text-xs uppercase font-semibold text-gray-400">
                            <tr>
                                <th className="px-6 py-4">রিটার্ন নং</th>
                                <th className="px-6 py-4">তারিখ</th>
                                <th className="px-6 py-4">পণ্য</th>
                                <th className="px-6 py-4">বিল নং</th>
                                <th className="px-6 py-4 text-right">ফেরত মূল্য</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {returns.data.length > 0 ? returns.data.map((ret: any) => (
                                <tr key={ret.id} className="hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-teal-400">
                                        {ret.return_number}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {new Date(ret.date).toLocaleDateString('bn-BD')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">📦</span>
                                            <div>
                                                <p className="font-medium text-white">{ret.product?.name}</p>
                                                <p className="text-xs text-gray-500">{ret.quantity} {ret.product?.unit}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">
                                        {ret.invoice?.invoice_number || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-white">
                                        {formatTaka(ret.refund_amount)}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        কোনো রিটার্ন পাওয়া যায়নি
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
