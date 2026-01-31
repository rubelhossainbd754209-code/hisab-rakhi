import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, Invoice, Product } from '@/types';
import axios from 'axios';

interface CreateReturnProps extends PageProps { }

export default function CreateReturn({ }: CreateReturnProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [invoiceResults, setInvoiceResults] = useState<Invoice[]>([]);
    const [productResults, setProductResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedItem, setSelectedItem] = useState<{ product: Product, quantity: number, unit_price: number } | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        invoice_id: '',
        product_id: '',
        quantity: 1,
        refund_amount: 0,
        reason: '',
    });

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        setIsSearching(true);
        try {
            const response = await axios.get(`/returns/search?q=${searchTerm}`);
            setInvoiceResults(response.data.invoices || []);
            setProductResults(response.data.products || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    const selectInvoice = (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setData('invoice_id', invoice.id);
        setInvoiceResults([]);
        setProductResults([]);
        setSearchTerm('');
    };

    // Direct product selection (without invoice - for quick returns)
    const selectProductDirect = (product: Product) => {
        setSelectedProduct(product);
        setSelectedItem({
            product: product,
            quantity: 1,
            unit_price: product.selling_price
        });
        setData(values => ({
            ...values,
            product_id: product.id,
            invoice_id: '', // No invoice linked
            refund_amount: product.selling_price
        }));
        setInvoiceResults([]);
        setProductResults([]);
        setSearchTerm('');
    };

    const selectItemToReturn = (item: any) => {
        setSelectedItem({
            product: item.product,
            quantity: item.quantity,
            unit_price: item.unit_price
        });
        setData(values => ({
            ...values,
            product_id: item.product.id,
            refund_amount: item.unit_price
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/returns', {
            onSuccess: () => {
                reset();
                setSelectedInvoice(null);
                setSelectedProduct(null);
                setSelectedItem(null);
            }
        });
    };

    const resetAll = () => {
        setSelectedInvoice(null);
        setSelectedProduct(null);
        setSelectedItem(null);
        setSearchTerm('');
        reset();
    };

    const hasResults = invoiceResults.length > 0 || productResults.length > 0;

    return (
        <DashboardLayout title="রিটার্ন করুন">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">পণ্য রিটার্ন</h1>
                    <p className="text-gray-400">বিল নম্বর, পণ্য কোড বা পণ্যের নাম দিয়ে খুঁজুন</p>
                </div>

                {/* Search Section */}
                {!selectedInvoice && !selectedProduct && (
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <input
                                type="text"
                                placeholder="বিল নম্বর (INV-...), পণ্য কোড (P-...) বা পণ্যের নাম..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            />
                            <button
                                type="submit"
                                disabled={isSearching}
                                className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-500 transition-all disabled:opacity-50"
                            >
                                {isSearching ? '...' : 'খুঁজুন'}
                            </button>
                        </form>

                        {/* Search Results */}
                        {hasResults && (
                            <div className="mt-4 space-y-4">
                                {/* Invoice Results */}
                                {invoiceResults.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-400 mb-2">📋 বিল সমূহ:</p>
                                        <div className="space-y-2">
                                            {invoiceResults.map(invoice => (
                                                <div
                                                    key={invoice.id}
                                                    onClick={() => selectInvoice(invoice)}
                                                    className="p-4 bg-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-700 border border-gray-600 hover:border-teal-500 transition-all"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="font-bold text-white">{invoice.invoice_number}</p>
                                                            <p className="text-sm text-gray-400">{invoice.party?.name || 'সাধারণ কাস্টমার'}</p>
                                                        </div>
                                                        <span className="text-teal-400 font-bold">নির্বাচন করুন ➔</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Product Results */}
                                {productResults.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-400 mb-2">📦 পণ্য সমূহ (সরাসরি রিটার্ন):</p>
                                        <div className="space-y-2">
                                            {productResults.map(product => (
                                                <div
                                                    key={product.id}
                                                    onClick={() => selectProductDirect(product)}
                                                    className="p-4 bg-gray-700/50 rounded-xl cursor-pointer hover:bg-gray-700 border border-gray-600 hover:border-orange-500 transition-all"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center text-xl">📦</div>
                                                            <div>
                                                                <p className="font-bold text-white">{product.name}</p>
                                                                <p className="text-sm text-gray-400">
                                                                    <span className="text-teal-400 font-mono">P-{String(product.id).substring(0, 6).toUpperCase()}</span>
                                                                    {' • '}মূল্য: ৳{product.selling_price}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <span className="text-orange-400 font-bold">সরাসরি রিটার্ন ➔</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* No Results */}
                        {!isSearching && searchTerm && !hasResults && (
                            <div className="mt-4 p-4 bg-gray-700/30 rounded-xl text-center">
                                <p className="text-gray-400">কোনো ফলাফল পাওয়া যায়নি</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Invoice Items Selection */}
                {selectedInvoice && !selectedItem && (
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">বিল বিস্তারিত: {selectedInvoice.invoice_number}</h2>
                            <button onClick={resetAll} className="text-gray-400 hover:text-white">✕ বাতিল</button>
                        </div>

                        <p className="text-gray-400 mb-4">কোন পণ্যটি ফেরত নিতে চান?</p>

                        <div className="space-y-3">
                            {selectedInvoice.items?.map((item: any) => (
                                <div
                                    key={item.id}
                                    onClick={() => selectItemToReturn(item)}
                                    className="flex justify-between items-center p-4 bg-gray-700/30 rounded-xl border border-gray-600 hover:border-teal-500 cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-xl">📦</div>
                                        <div>
                                            <p className="font-medium text-white">{item.product?.name}</p>
                                            <p className="text-sm text-gray-400">{item.quantity} {item.product?.unit} x ৳{item.unit_price}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-white">৳ {item.total_price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Final Refund Form */}
                {selectedItem && (
                    <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">রিটার্ন কনফার্ম করুন</h2>
                            <button onClick={resetAll} className="text-gray-400 hover:text-white">✕ বাতিল</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="p-4 bg-teal-900/20 rounded-xl border border-teal-800">
                                <p className="text-teal-400 text-sm">পণ্য</p>
                                <p className="text-xl font-bold text-white">{selectedItem.product.name}</p>
                                <p className="text-gray-400 text-sm">বিক্রয় মূল্য: ৳{selectedItem.unit_price}</p>
                                {!data.invoice_id && (
                                    <p className="text-orange-400 text-xs mt-1">⚠️ সরাসরি রিটার্ন (বিল ছাড়া)</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-400 mb-2">পরিমাণ (Quantity)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.quantity}
                                        onChange={e => {
                                            const qty = Number(e.target.value);
                                            setData(d => ({ ...d, quantity: qty, refund_amount: qty * selectedItem.unit_price }));
                                        }}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:border-teal-500"
                                    />
                                    {errors.quantity && <p className="text-red-400 text-sm mt-1">{errors.quantity}</p>}
                                </div>
                                <div>
                                    <label className="block text-gray-400 mb-2">ফেরত টাকার পরিমাণ (Refund Amount)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.refund_amount}
                                        onChange={e => setData('refund_amount', Number(e.target.value))}
                                        className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:border-teal-500"
                                    />
                                    {errors.refund_amount && <p className="text-red-400 text-sm mt-1">{errors.refund_amount}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-400 mb-2">কারণ (Reason)</label>
                                <textarea
                                    value={data.reason}
                                    onChange={e => setData('reason', e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:border-teal-500"
                                    placeholder="কেন ফেরত দিচ্ছেন? (অপশনাল)"
                                    rows={3}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold text-lg hover:from-teal-500 hover:to-teal-400 shadow-lg shadow-teal-500/20 transform hover:scale-[1.01] transition-all disabled:opacity-50"
                            >
                                {processing ? 'প্রসেসিং...' : 'রিটার্ন সম্পন্ন করুন'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
