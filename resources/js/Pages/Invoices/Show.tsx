import { useRef } from 'react';
import { Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, Invoice } from '@/types';

interface ShowProps extends PageProps {
    invoice: Invoice & {
        items?: Array<{
            id: string;
            product: { id: string; name: string; unit: string };
            quantity: number;
            unit_price: number;
            total_price: number;
            warranty_days?: number;
        }>;
        party?: { name: string; phone: string; address: string };
        business?: { name: string; phone: string; address: string; logo: string };
    };
}

export default function Show({ invoice }: ShowProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const formatTaka = (amount: number) => '৳' + Number(amount || 0).toLocaleString('bn-BD');
    const formatDate = (date: string) => new Date(date).toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const logoUrl = invoice.business?.logo || '';

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>বিল - ${invoice.invoice_number}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap');
                    
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Noto Sans Bengali', 'Segoe UI', Arial, sans-serif; 
                        padding: 15px;
                        color: #1a1a1a;
                        max-width: 80mm;
                        margin: 0 auto;
                        font-size: 12px;
                        line-height: 1.4;
                    }
                    
                    /* Header Section */
                    .header { 
                        text-align: center; 
                        padding-bottom: 12px; 
                        border-bottom: 2px double #333;
                        margin-bottom: 10px;
                    }
                    .logo-section {
                        margin-bottom: 8px;
                    }
                    .logo-section img {
                        max-height: 50px;
                        max-width: 120px;
                        object-fit: contain;
                    }
                    .logo-placeholder {
                        font-size: 28px;
                        margin-bottom: 5px;
                    }
                    .business-name { 
                        font-size: 20px; 
                        font-weight: 700; 
                        color: #006A4E;
                        margin-bottom: 3px;
                    }
                    .business-tagline {
                        font-size: 10px;
                        color: #666;
                        margin-bottom: 5px;
                    }
                    .business-info { 
                        font-size: 10px; 
                        color: #555;
                        line-height: 1.3;
                    }
                    
                    /* Invoice Info */
                    .invoice-meta {
                        display: flex;
                        justify-content: space-between;
                        background: #f8f9fa;
                        padding: 8px 10px;
                        border-radius: 5px;
                        margin: 10px 0;
                        font-size: 11px;
                    }
                    .invoice-number { 
                        font-weight: 700; 
                        font-size: 13px;
                        color: #006A4E;
                    }
                    
                    /* Customer Section */
                    .customer { 
                        padding: 10px;
                        margin: 10px 0;
                        background: #f0f7f5;
                        border-left: 3px solid #006A4E;
                        border-radius: 0 5px 5px 0;
                    }
                    .customer-label {
                        font-size: 9px;
                        color: #666;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .customer-name {
                        font-weight: 600;
                        font-size: 13px;
                        color: #1a1a1a;
                    }
                    .customer-details {
                        font-size: 10px;
                        color: #555;
                    }
                    
                    /* Items Table */
                    .items { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 12px 0;
                    }
                    .items th { 
                        background: #006A4E;
                        color: white;
                        padding: 8px 5px;
                        font-size: 10px;
                        font-weight: 600;
                        text-align: left;
                    }
                    .items th:last-child,
                    .items td:last-child { text-align: right; }
                    .items td { 
                        padding: 8px 5px;
                        border-bottom: 1px dashed #ddd;
                        font-size: 11px;
                    }
                    .items tr:last-child td {
                        border-bottom: none;
                    }
                    .items .qty { text-align: center; }
                    
                    /* Totals */
                    .totals {
                        background: #f8f9fa;
                        padding: 10px;
                        border-radius: 5px;
                        margin-top: 10px;
                    }
                    .totals-row { 
                        display: flex; 
                        justify-content: space-between; 
                        padding: 4px 0;
                        font-size: 11px;
                    }
                    .totals-row.grand { 
                        font-size: 16px; 
                        font-weight: 700; 
                        color: #006A4E;
                        border-top: 2px solid #006A4E;
                        margin-top: 8px;
                        padding-top: 10px;
                    }
                    .totals-row.due {
                        color: #dc3545;
                        font-weight: 600;
                    }
                    .totals-row.paid {
                        color: #28a745;
                    }
                    
                    /* Status Badge */
                    .status { 
                        text-align: center; 
                        margin: 15px 0; 
                        padding: 10px;
                        border-radius: 8px;
                        font-weight: 700;
                        font-size: 13px;
                    }
                    .status.paid { background: #d4edda; color: #155724; }
                    .status.partial { background: #fff3cd; color: #856404; }
                    .status.unpaid { background: #f8d7da; color: #721c24; }
                    
                    /* Footer */
                    .footer { 
                        text-align: center; 
                        margin-top: 15px;
                        padding-top: 12px;
                        border-top: 2px double #333;
                    }
                    .thank-you {
                        font-size: 14px;
                        font-weight: 600;
                        color: #006A4E;
                        margin-bottom: 5px;
                    }
                    .footer-msg {
                        font-size: 10px;
                        color: #666;
                        margin-bottom: 3px;
                    }
                    .footer-brand {
                        font-size: 9px;
                        color: #999;
                        margin-top: 8px;
                    }
                    
                    /* QR Placeholder */
                    .qr-section {
                        text-align: center;
                        margin: 10px 0;
                    }
                    
                    @media print {
                        body { padding: 5px; }
                        @page { margin: 3mm; }
                    }
                </style>
            </head>
            <body>
                <!-- Header with Logo -->
                <div class="header">
                    <div class="logo-section">
                        ${logoUrl ?
                `<img src="${logoUrl}" alt="Logo" onerror="this.style.display='none'"/>` :
                `<div class="logo-placeholder">🏪</div>`
            }
                    </div>
                    <div class="business-name">${invoice.business?.name || 'আপনার দোকান'}</div>
                    <div class="business-info">
                        ${invoice.business?.address ? `📍 ${invoice.business.address}<br/>` : ''}
                        ${invoice.business?.phone ? `📞 ${invoice.business.phone}` : ''}
                    </div>
                </div>
                
                <!-- Invoice Meta -->
                <div class="invoice-meta">
                    <div>
                        <div class="invoice-number">বিল# ${invoice.invoice_number}</div>
                    </div>
                    <div style="text-align: right;">
                        <div>📅 ${formatDate(invoice.date)}</div>
                    </div>
                </div>

                <!-- Customer Info -->
                <div class="customer">
                    <div class="customer-label">গ্রাহক</div>
                    <div class="customer-name">${invoice.party?.name || 'সাধারণ গ্রাহক'}</div>
                    ${invoice.party?.phone ? `<div class="customer-details">📱 ${invoice.party.phone}</div>` : ''}
                    ${invoice.party?.address ? `<div class="customer-details">📍 ${invoice.party.address}</div>` : ''}
                </div>

                <!-- Items Table -->
                <table class="items">
                    <thead>
                        <tr>
                            <th style="width: 40%">পণ্যের নাম</th>
                            <th class="qty" style="width: 12%">পরিমাণ</th>
                            <th style="width: 18%">দর</th>
                            <th style="width: 15%">ওয়ারেন্টি</th>
                            <th style="width: 15%">টাকা</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(invoice.items || []).map(item => `
                            <tr>
                                <td>${item.product?.name || 'N/A'}</td>
                                <td class="qty">${item.quantity}</td>
                                <td>${formatTaka(item.unit_price)}</td>
                                <td style="text-align: center;">${item.warranty_days && item.warranty_days > 0 ? `<span style="color: #006A4E; font-weight: 600;">🛡️ ${item.warranty_days} দিন</span>` : '<span style="color: #999;">-</span>'}</td>
                                <td><strong>${formatTaka(item.total_price)}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <!-- Warranty Notice -->
                ${(invoice.items || []).some(item => item.warranty_days && item.warranty_days > 0) ? `
                    <div style="background: #f0f7f5; border: 1px solid #006A4E; border-radius: 5px; padding: 8px; margin: 10px 0; font-size: 10px;">
                        <strong style="color: #006A4E;">🛡️ ওয়ারেন্টি শর্তাবলী:</strong>
                        <ul style="margin: 5px 0 0 15px; color: #555;">
                            <li>ওয়ারেন্টি শুধুমাত্র কারিগরি সমস্যার জন্য প্রযোজ্য</li>
                            <li>ভাংচুর বা অপব্যবহারে ওয়ারেন্টি বাতিল</li>
                            <li>ওয়ারেন্টি দাবির জন্য এই বিলটি সংরক্ষণ করুন</li>
                        </ul>
                    </div>
                ` : ''}

                <!-- Totals -->
                <div class="totals">
                    <div class="totals-row">
                        <span>উপমোট:</span>
                        <span>${formatTaka(invoice.subtotal)}</span>
                    </div>
                    ${Number(invoice.discount) > 0 ? `
                        <div class="totals-row">
                            <span>ছাড়:</span>
                            <span style="color: #28a745;">-${formatTaka(invoice.discount)}</span>
                        </div>
                    ` : ''}
                    ${Number(invoice.tax) > 0 ? `
                        <div class="totals-row">
                            <span>কর/ভ্যাট:</span>
                            <span>+${formatTaka(invoice.tax)}</span>
                        </div>
                    ` : ''}
                    <div class="totals-row grand">
                        <span>সর্বমোট:</span>
                        <span>${formatTaka(invoice.total_amount)}</span>
                    </div>
                    <div class="totals-row paid">
                        <span>পরিশোধ:</span>
                        <span>${formatTaka(invoice.paid_amount)}</span>
                    </div>
                    ${Number(invoice.due_amount) > 0 ? `
                        <div class="totals-row due">
                            <span>বাকি:</span>
                            <span>${formatTaka(invoice.due_amount)}</span>
                        </div>
                    ` : ''}
                </div>

                <!-- Status -->
                <div class="status ${invoice.status}">
                    ${invoice.status === 'paid' ? '✅ সম্পূর্ণ পরিশোধিত' :
                invoice.status === 'partial' ? '⏳ বাকি আছে' : '❌ অপরিশোধিত'}
                </div>

                <!-- Footer with Signature -->
                <div class="footer" style="text-align: left;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 15px;">
                        <div style="text-align: left;">
                            <div class="thank-you">🙏 ধন্যবাদ!</div>
                            <div class="footer-msg">আপনার পৃষ্ঠপোষকতায় আমরা কৃতজ্ঞ</div>
                            <div class="footer-msg">আবার আসবেন, সুস্বাগতম!</div>
                        </div>
                        <div style="text-align: right; min-width: 100px;">
                            <div style="border-top: 1px solid #333; padding-top: 5px; margin-top: 20px;">
                                <div style="font-size: 10px; color: #555;">বিক্রেতার স্বাক্ষর</div>
                            </div>
                        </div>
                    </div>
                    <div class="footer-brand" style="text-align: center;">─────────────────</div>
                    <div class="footer-brand" style="text-align: center;">বিল তৈরি: হিসাব রাখি</div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 300);
    };

    return (
        <DashboardLayout title={`বিল: ${invoice.invoice_number}`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <Link href="/invoices" className="text-gray-400 hover:text-white mb-2 inline-block">
                            ← বিল তালিকায় ফিরে যান
                        </Link>
                        <h1 className="text-2xl font-bold text-white">{invoice.invoice_number}</h1>
                        <p className="text-gray-400">{formatDate(invoice.date)}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold hover:from-teal-500 hover:to-teal-400 shadow-lg shadow-teal-500/20 transition-all"
                        >
                            🖨️ প্রিন্ট করুন
                        </button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div ref={printRef} className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                    {/* Business & Customer Info */}
                    <div className="p-6 border-b border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-400 text-sm mb-1">বিক্রেতা</p>
                                <p className="text-xl font-bold text-white">{invoice.business?.name || 'আপনার ব্যবসা'}</p>
                                <p className="text-gray-400">{invoice.business?.address}</p>
                                <p className="text-gray-400">{invoice.business?.phone}</p>
                            </div>
                            <div className="md:text-right">
                                <p className="text-gray-400 text-sm mb-1">ক্রেতা</p>
                                <p className="text-xl font-bold text-white">{invoice.party?.name || 'সাধারণ কাস্টমার'}</p>
                                {invoice.party?.phone && <p className="text-gray-400">{invoice.party.phone}</p>}
                                {invoice.party?.address && <p className="text-gray-400">{invoice.party.address}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-900/50">
                                <tr className="text-gray-400 text-sm">
                                    <th className="text-left px-6 py-4">পণ্য</th>
                                    <th className="text-center px-4 py-4">পরিমাণ</th>
                                    <th className="text-right px-4 py-4">একক দাম</th>
                                    <th className="text-right px-6 py-4">মোট</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {(invoice.items || []).map(item => (
                                    <tr key={item.id} className="text-white">
                                        <td className="px-6 py-4">
                                            <p className="font-medium">{item.product?.name}</p>
                                        </td>
                                        <td className="px-4 py-4 text-center text-gray-300">
                                            {item.quantity} {item.product?.unit}
                                        </td>
                                        <td className="px-4 py-4 text-right text-gray-300">
                                            {formatTaka(item.unit_price)}
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold">
                                            {formatTaka(item.total_price)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                    <div className="p-6 bg-gray-900/30 border-t border-gray-700">
                        <div className="max-w-xs ml-auto space-y-2">
                            <div className="flex justify-between text-gray-300">
                                <span>উপমোট:</span>
                                <span>{formatTaka(invoice.subtotal)}</span>
                            </div>
                            {Number(invoice.discount) > 0 && (
                                <div className="flex justify-between text-gray-300">
                                    <span>ছাড়:</span>
                                    <span className="text-green-400">-{formatTaka(invoice.discount)}</span>
                                </div>
                            )}
                            {Number(invoice.tax) > 0 && (
                                <div className="flex justify-between text-gray-300">
                                    <span>কর/ভ্যাট:</span>
                                    <span>+{formatTaka(invoice.tax)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-600">
                                <span>সর্বমোট:</span>
                                <span>{formatTaka(invoice.total_amount)}</span>
                            </div>
                            <div className="flex justify-between text-green-400">
                                <span>পরিশোধ:</span>
                                <span>{formatTaka(invoice.paid_amount)}</span>
                            </div>
                            {Number(invoice.due_amount) > 0 && (
                                <div className="flex justify-between text-red-400 font-bold">
                                    <span>বাকি:</span>
                                    <span>{formatTaka(invoice.due_amount)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div className={`p-4 text-center font-bold text-lg ${invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                        invoice.status === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                        }`}>
                        {invoice.status === 'paid' ? '✅ সম্পূর্ণ পরিশোধিত' :
                            invoice.status === 'partial' ? '⏳ বাকি আছে' : '❌ অপরিশোধিত'}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold hover:from-blue-500 hover:to-blue-400 shadow-lg transition-all transform hover:scale-105"
                    >
                        🖨️ প্রিন্ট / ডাউনলোড
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
