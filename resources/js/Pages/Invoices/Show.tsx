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
                        padding: 15px 25px;
                        color: #000;
                        background: #fff;
                        width: 210mm;
                        max-height: 297mm;
                        margin: 0 auto;
                        font-size: 12px;
                        line-height: 1.4;
                    }
                    
                    /* Header Section */
                    .header { 
                        text-align: center; 
                        padding-bottom: 12px; 
                        border-bottom: 2px solid #000;
                        margin-bottom: 10px;
                    }
                    .logo-section {
                        margin-bottom: 5px;
                    }
                    .logo-section img {
                        max-height: 50px;
                        max-width: 150px;
                        object-fit: contain;
                        filter: grayscale(100%);
                    }
                    .business-name { 
                        font-size: 22px; 
                        font-weight: 700; 
                        color: #000;
                        margin-bottom: 3px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .business-info { 
                        font-size: 11px; 
                        color: #333;
                        line-height: 1.3;
                    }
                    .business-info span {
                        margin: 0 10px;
                    }
                    
                    /* Invoice Title */
                    .invoice-title {
                        text-align: center;
                        font-size: 16px;
                        font-weight: 700;
                        margin: 10px 0;
                        padding: 6px;
                        border: 2px solid #000;
                        display: inline-block;
                        width: 100%;
                    }
                    
                    /* Invoice Meta & Customer Info */
                    .info-section {
                        display: flex;
                        justify-content: space-between;
                        margin: 12px 0;
                        padding: 10px 15px;
                        border: 1px solid #000;
                    }
                    .info-box {
                        flex: 1;
                    }
                    .info-box:first-child {
                        border-right: 1px solid #000;
                        padding-right: 15px;
                        margin-right: 15px;
                    }
                    .info-label {
                        font-size: 10px;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        color: #333;
                        margin-bottom: 3px;
                        border-bottom: 1px solid #333;
                        padding-bottom: 2px;
                    }
                    .info-value {
                        font-size: 13px;
                        font-weight: 600;
                        color: #000;
                        margin-bottom: 2px;
                    }
                    .info-details {
                        font-size: 11px;
                        color: #333;
                    }
                    
                    /* Items Table */
                    .items { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin: 10px 0;
                    }
                    .items th { 
                        background: #000;
                        color: #fff;
                        padding: 6px 8px;
                        font-size: 11px;
                        font-weight: 600;
                        text-align: left;
                        border: 1px solid #000;
                    }
                    .items th.center { text-align: center; }
                    .items th.right { text-align: right; }
                    .items td { 
                        padding: 6px 8px;
                        border: 1px solid #000;
                        font-size: 11px;
                        vertical-align: middle;
                    }
                    .items td.center { text-align: center; }
                    .items td.right { text-align: right; }
                    .items tbody tr:nth-child(even) {
                        background: #f5f5f5;
                    }
                    .items .product-name {
                        font-weight: 600;
                    }
                    .items .warranty-badge {
                        font-size: 10px;
                        padding: 2px 5px;
                        border: 1px solid #000;
                        display: inline-block;
                    }
                    
                    /* Totals Section */
                    .totals-section {
                        display: flex;
                        justify-content: flex-end;
                        margin: 10px 0;
                    }
                    .totals {
                        width: 280px;
                        border: 2px solid #000;
                    }
                    .totals-row { 
                        display: flex; 
                        justify-content: space-between; 
                        padding: 5px 10px;
                        font-size: 11px;
                        border-bottom: 1px solid #ccc;
                    }
                    .totals-row:last-child {
                        border-bottom: none;
                    }
                    .totals-row.grand { 
                        font-size: 14px; 
                        font-weight: 700; 
                        background: #000;
                        color: #fff;
                        padding: 8px 10px;
                    }
                    .totals-row.due {
                        font-weight: 700;
                        background: #f0f0f0;
                    }
                    .totals-row.paid {
                        font-weight: 600;
                    }
                    
                    /* Status Badge */
                    .status { 
                        text-align: center; 
                        margin: 10px 0; 
                        padding: 8px;
                        font-weight: 700;
                        font-size: 12px;
                        border: 2px solid #000;
                    }
                    .status.paid { background: #fff; }
                    .status.partial { background: #f5f5f5; }
                    .status.unpaid { background: #e5e5e5; }
                    
                    /* Warranty Notice */
                    .warranty-notice {
                        border: 1px solid #000;
                        padding: 8px 10px;
                        margin: 8px 0;
                        font-size: 10px;
                    }
                    .warranty-notice strong {
                        display: block;
                        margin-bottom: 4px;
                        font-size: 11px;
                    }
                    .warranty-notice ul {
                        margin-left: 15px;
                    }
                    .warranty-notice li {
                        margin-bottom: 1px;
                    }
                    
                    /* Signature Section */
                    .signature-section {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 25px;
                        padding-top: 15px;
                    }
                    .signature-box {
                        text-align: center;
                        width: 150px;
                    }
                    .signature-line {
                        border-top: 1px solid #000;
                        padding-top: 5px;
                        font-size: 10px;
                        font-weight: 600;
                    }
                    
                    /* Footer */
                    .footer { 
                        text-align: center; 
                        margin-top: 15px;
                        padding-top: 10px;
                        border-top: 1px solid #000;
                    }
                    .thank-you {
                        font-size: 14px;
                        font-weight: 700;
                        margin-bottom: 3px;
                    }
                    .footer-msg {
                        font-size: 10px;
                        color: #333;
                    }
                    .footer-brand {
                        font-size: 9px;
                        color: #666;
                        margin-top: 8px;
                        padding-top: 5px;
                        border-top: 1px dashed #999;
                    }
                    
                    /* Print Styles */
                    @media print {
                        body { 
                            padding: 10mm 12mm;
                            width: 100%;
                            max-height: 277mm;
                        }
                        @page { 
                            size: A4;
                            margin: 10mm;
                        }
                        .items tbody tr:nth-child(even) {
                            background: #f5f5f5 !important;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .items th {
                            background: #000 !important;
                            color: #fff !important;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        .totals-row.grand {
                            background: #000 !important;
                            color: #fff !important;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                    }
                </style>
            </head>
            <body>
                <!-- Header with Logo -->
                <div class="header">
                    <div class="logo-section">
                        ${logoUrl ?
                `<img src="${logoUrl}" alt="Logo" onerror="this.style.display='none'"/>` :
                ''
            }
                    </div>
                    <div class="business-name">${invoice.business?.name || 'আপনার দোকান'}</div>
                    <div class="business-info">
                        ${invoice.business?.address ? `<span>${invoice.business.address}</span>` : ''}
                        ${invoice.business?.phone ? `<span>ফোন: ${invoice.business.phone}</span>` : ''}
                    </div>
                </div>
                
                <!-- Invoice Title -->
                <div class="invoice-title">বিক্রয় চালান / SALES INVOICE</div>
                
                <!-- Invoice Meta & Customer Info -->
                <div class="info-section">
                    <div class="info-box">
                        <div class="info-label">চালান তথ্য</div>
                        <div class="info-value">বিল নং: ${invoice.invoice_number}</div>
                        <div class="info-details">তারিখ: ${formatDate(invoice.date)}</div>
                    </div>
                    <div class="info-box">
                        <div class="info-label">গ্রাহক তথ্য</div>
                        <div class="info-value">${invoice.party?.name || 'সাধারণ গ্রাহক'}</div>
                        ${invoice.party?.phone ? `<div class="info-details">মোবাইল: ${invoice.party.phone}</div>` : ''}
                        ${invoice.party?.address ? `<div class="info-details">ঠিকানা: ${invoice.party.address}</div>` : ''}
                    </div>
                </div>

                <!-- Items Table -->
                <table class="items">
                    <thead>
                        <tr>
                            <th style="width: 5%">ক্রম</th>
                            <th style="width: 35%">পণ্যের বিবরণ</th>
                            <th class="center" style="width: 12%">পরিমাণ</th>
                            <th class="right" style="width: 15%">একক দর</th>
                            <th class="center" style="width: 15%">ওয়ারেন্টি</th>
                            <th class="right" style="width: 18%">মোট টাকা</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(invoice.items || []).map((item, index) => `
                            <tr>
                                <td class="center">${index + 1}</td>
                                <td class="product-name">${item.product?.name || 'N/A'}</td>
                                <td class="center">${item.quantity}</td>
                                <td class="right">${formatTaka(item.unit_price)}</td>
                                <td class="center">${item.warranty_days && item.warranty_days > 0 ? `<span class="warranty-badge">${item.warranty_days} দিন</span>` : '-'}</td>
                                <td class="right"><strong>${formatTaka(item.total_price)}</strong></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <!-- Warranty Notice -->
                ${(invoice.items || []).some(item => item.warranty_days && item.warranty_days > 0) ? `
                    <div class="warranty-notice">
                        <strong>ওয়ারেন্টি শর্তাবলী:</strong>
                        <ul>
                            <li>ওয়ারেন্টি শুধুমাত্র কারিগরি সমস্যার জন্য প্রযোজ্য</li>
                            <li>ভাংচুর বা অপব্যবহারে ওয়ারেন্টি বাতিল হবে</li>
                            <li>ওয়ারেন্টি দাবির জন্য এই বিলটি সংরক্ষণ করুন</li>
                        </ul>
                    </div>
                ` : ''}

                <!-- Totals -->
                <div class="totals-section">
                    <div class="totals">
                        <div class="totals-row">
                            <span>উপমোট:</span>
                            <span>${formatTaka(invoice.subtotal)}</span>
                        </div>
                        ${Number(invoice.discount) > 0 ? `
                            <div class="totals-row">
                                <span>ছাড়:</span>
                                <span>(-) ${formatTaka(invoice.discount)}</span>
                            </div>
                        ` : ''}
                        ${Number(invoice.tax) > 0 ? `
                            <div class="totals-row">
                                <span>কর/ভ্যাট:</span>
                                <span>(+) ${formatTaka(invoice.tax)}</span>
                            </div>
                        ` : ''}
                        <div class="totals-row grand">
                            <span>সর্বমোট:</span>
                            <span>${formatTaka(invoice.total_amount)}</span>
                        </div>
                        <div class="totals-row paid">
                            <span>পরিশোধিত:</span>
                            <span>${formatTaka(invoice.paid_amount)}</span>
                        </div>
                        ${Number(invoice.due_amount) > 0 ? `
                            <div class="totals-row due">
                                <span>বাকি:</span>
                                <span>${formatTaka(invoice.due_amount)}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>

                <!-- Status -->
                <div class="status ${invoice.status}">
                    ${invoice.status === 'paid' ? '● সম্পূর্ণ পরিশোধিত (PAID)' :
                invoice.status === 'partial' ? '● আংশিক পরিশোধিত (PARTIAL)' : '● অপরিশোধিত (UNPAID)'}
                </div>

                <!-- Signature Section -->
                <div class="signature-section">
                    <div class="signature-box">
                        <div class="signature-line">গ্রাহকের স্বাক্ষর</div>
                    </div>
                    <div class="signature-box">
                        <div class="signature-line">বিক্রেতার স্বাক্ষর</div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <div class="thank-you">ধন্যবাদ!</div>
                    <div class="footer-msg">আপনার পৃষ্ঠপোষকতায় আমরা কৃতজ্ঞ। আবার আসবেন!</div>
                    <div class="footer-brand">বিল তৈরি: হিসাব রাখি সফটওয়্যার</div>
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
