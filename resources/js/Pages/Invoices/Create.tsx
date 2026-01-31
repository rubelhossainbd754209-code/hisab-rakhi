import { useState, useMemo, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { PageProps, Product, Party } from '@/types';
import axios from 'axios';

interface CreateInvoiceProps extends PageProps {
    products: Product[];
    parties: Party[];
}

interface CartItem {
    product_id: string;
    name: string;
    unit_price: number;
    quantity: number;
    total_price: number;
    stock: number;
    purchase_price?: number;
    warranty_days: number;
}

export default function CreateInvoice({ products, parties }: CreateInvoiceProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [activeTab, setActiveTab] = useState<'cash' | 'due'>('cash');

    // Customer Selection State
    const [customerSearch, setCustomerSearch] = useState('');
    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Party | null>(null);
    const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' });

    // Form for invoice details
    const { data, setData, post, processing, errors } = useForm({
        party_id: '',
        date: new Date().toISOString().split('T')[0],
        subtotal: 0,
        discount: 0,
        tax: 0,
        total_amount: 0,
        paid_amount: 0,
        items: [] as any[],
        notes: '',
        // New customer fields
        new_customer_name: '',
        new_customer_phone: '',
        new_customer_address: '',
    });

    // Filter customers based on search
    const filteredCustomers = parties.filter(p =>
        p.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        p.phone?.includes(customerSearch)
    );

    // Handle customer selection
    const selectCustomer = (customer: Party) => {
        setSelectedCustomer(customer);
        setData('party_id', customer.id);
        setCustomerSearch(customer.name);
        setShowCustomerDropdown(false);
        setIsNewCustomer(false);
    };

    // Handle new customer input
    const handleCustomerSearchChange = (value: string) => {
        setCustomerSearch(value);
        setShowCustomerDropdown(true);

        // Check if this matches any existing customer
        const match = parties.find(p =>
            p.name.toLowerCase() === value.toLowerCase() ||
            p.phone === value
        );

        if (match) {
            selectCustomer(match);
        } else if (value.length > 0) {
            setSelectedCustomer(null);
            setData('party_id', '');
            // Check if it looks like a phone number
            if (/^\d+$/.test(value)) {
                setNewCustomer(prev => ({ ...prev, phone: value }));
            } else {
                setNewCustomer(prev => ({ ...prev, name: value }));
            }
        }
    };

    // Create new customer mode
    const enableNewCustomerMode = () => {
        setIsNewCustomer(true);
        setShowCustomerDropdown(false);
        setSelectedCustomer(null);
        // Pre-fill from search
        if (/^\d+$/.test(customerSearch)) {
            setNewCustomer({ name: '', phone: customerSearch, address: '' });
        } else {
            setNewCustomer({ name: customerSearch, phone: '', address: '' });
        }
    };

    // Add product to cart
    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product_id === product.id);
            if (existing) {
                if (existing.quantity + 1 > product.stock) {
                    alert('স্টক শেষ!');
                    return prev;
                }
                return prev.map(item =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1, total_price: (item.quantity + 1) * item.unit_price }
                        : item
                );
            }
            return [...prev, {
                product_id: product.id,
                name: product.name,
                unit_price: product.selling_price,
                stock: product.stock,
                quantity: 1,
                total_price: product.selling_price,
                purchase_price: product.purchase_price,
                warranty_days: 0
            }];
        });
    };

    // Update warranty days for item
    const updateWarranty = (productId: string, days: number) => {
        setCart(prev => prev.map(item =>
            item.product_id === productId
                ? { ...item, warranty_days: Math.max(0, days) }
                : item
        ));
    };

    // Update cart item quantity
    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;
        setCart(prev => prev.map(item => {
            if (item.product_id === productId) {
                if (quantity > item.stock) {
                    alert('স্টক এর চেয়ে বেশি পণ্য বিক্রি করা যাবে না।');
                    return item;
                }
                return { ...item, quantity, total_price: quantity * item.unit_price };
            }
            return item;
        }));
    };

    // Remove item from cart
    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.product_id !== productId));
    };

    // Calculate Totals
    useMemo(() => {
        const subtotal = cart.reduce((sum, item) => sum + item.total_price, 0);
        const total = subtotal - Number(data.discount);

        setData(prev => ({
            ...prev,
            subtotal,
            total_amount: total,
            items: cart,
            paid_amount: activeTab === 'cash' ? total : prev.paid_amount,
            // Set new customer data
            new_customer_name: isNewCustomer ? newCustomer.name : '',
            new_customer_phone: isNewCustomer ? newCustomer.phone : '',
            new_customer_address: isNewCustomer ? newCustomer.address : '',
        }));
    }, [cart, data.discount, isNewCustomer, newCustomer, activeTab]);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return alert('কার্টে কোনো পণ্য নেই!');
        post('/invoices');
    };

    return (
        <DashboardLayout title="নতুন বিল তৈরি করুন">
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">

                {/* Left: Product Catalog */}
                <div className="flex-1 flex flex-col bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
                    {/* Search Header */}
                    <div className="p-4 border-b border-gray-700">
                        <input
                            type="text"
                            placeholder="পণ্য খুঁজুন (নাম বা কোড)..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-700 border-0 text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500"
                            autoFocus
                        />
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto p-4 animate-fade-in-up">
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                            {filteredProducts.map(product => (
                                <button
                                    key={product.id}
                                    onClick={() => addToCart(product)}
                                    disabled={product.stock <= 0}
                                    className={`relative p-3 rounded-xl text-left transition-all border ${product.stock <= 0
                                        ? 'bg-gray-700/50 border-gray-700 opacity-60 cursor-not-allowed'
                                        : 'bg-gray-700 border-gray-600 hover:border-teal-500 hover:shadow-lg hover:shadow-teal-500/10 active:scale-95'
                                        }`}
                                >
                                    <div className="text-2xl mb-2">📦</div>
                                    <h3 className="font-semibold text-white text-sm line-clamp-2 min-h-[40px]">
                                        {product.name}
                                    </h3>
                                    <div className="flex justify-between items-end mt-2">
                                        <span className="font-bold text-teal-400">৳{product.selling_price}</span>
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${product.stock > 0 ? 'bg-gray-600 text-gray-300' : 'bg-red-500/20 text-red-300'
                                            }`}>
                                            {product.stock}
                                        </span>
                                    </div>
                                    {cart.find(c => c.product_id === product.id) && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                            {cart.find(c => c.product_id === product.id)?.quantity}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                        {filteredProducts.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <span className="text-4xl mb-2">🔍</span>
                                <p>কোনো পণ্য পাওয়া যায়নি</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Cart & Billing */}
                <div className="w-full lg:w-[420px] flex flex-col bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">

                    {/* Customer Selection Card */}
                    <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 border-b border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg">👤</span>
                            <h3 className="text-sm font-semibold text-white">গ্রাহক তথ্য</h3>
                            {selectedCustomer && (
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">পুরাতন গ্রাহক</span>
                            )}
                            {isNewCustomer && (
                                <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">নতুন গ্রাহক</span>
                            )}
                        </div>

                        {/* Customer Search/Select */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="গ্রাহকের নাম বা মোবাইল নম্বর..."
                                value={customerSearch}
                                onChange={e => handleCustomerSearchChange(e.target.value)}
                                onFocus={() => setShowCustomerDropdown(true)}
                                className="w-full px-3 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:border-teal-500 outline-none"
                            />

                            {/* Dropdown */}
                            {showCustomerDropdown && customerSearch && (
                                <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                    {filteredCustomers.length > 0 ? (
                                        <>
                                            {filteredCustomers.slice(0, 5).map(customer => (
                                                <button
                                                    key={customer.id}
                                                    onClick={() => selectCustomer(customer)}
                                                    className="w-full text-left px-3 py-2 hover:bg-gray-600 transition-colors border-b border-gray-600 last:border-0"
                                                >
                                                    <p className="font-medium text-white text-sm">{customer.name}</p>
                                                    <p className="text-xs text-gray-400">{customer.phone}</p>
                                                </button>
                                            ))}
                                        </>
                                    ) : (
                                        <div className="p-3 text-center">
                                            <p className="text-gray-400 text-sm mb-2">কোনো গ্রাহক পাওয়া যায়নি</p>
                                            <button
                                                onClick={enableNewCustomerMode}
                                                className="text-teal-400 text-sm font-medium hover:text-teal-300"
                                            >
                                                ➕ নতুন গ্রাহক যোগ করুন
                                            </button>
                                        </div>
                                    )}
                                    {filteredCustomers.length > 0 && (
                                        <button
                                            onClick={enableNewCustomerMode}
                                            className="w-full text-left px-3 py-2 bg-teal-600/20 text-teal-400 hover:bg-teal-600/30 text-sm"
                                        >
                                            ➕ নতুন গ্রাহক হিসেবে যোগ করুন
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* New Customer Form */}
                        {isNewCustomer && (
                            <div className="mt-3 space-y-2 animate-fade-in-up">
                                <input
                                    type="text"
                                    placeholder="গ্রাহকের নাম *"
                                    value={newCustomer.name}
                                    onChange={e => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:border-teal-500 outline-none"
                                />
                                <input
                                    type="tel"
                                    placeholder="মোবাইল নম্বর *"
                                    value={newCustomer.phone}
                                    onChange={e => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:border-teal-500 outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="ঠিকানা (ঐচ্ছিক)"
                                    value={newCustomer.address}
                                    onChange={e => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:border-teal-500 outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => { setIsNewCustomer(false); setNewCustomer({ name: '', phone: '', address: '' }); }}
                                    className="text-xs text-gray-400 hover:text-white"
                                >
                                    ✕ বাতিল
                                </button>
                            </div>
                        )}

                        {/* Selected Customer Display */}
                        {selectedCustomer && !isNewCustomer && (
                            <div className="mt-2 p-2 bg-gray-700/50 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-white">{selectedCustomer.name}</p>
                                    <p className="text-xs text-gray-400">{selectedCustomer.phone}</p>
                                </div>
                                <button
                                    onClick={() => { setSelectedCustomer(null); setCustomerSearch(''); setData('party_id', ''); }}
                                    className="text-gray-400 hover:text-white text-sm"
                                >✕</button>
                            </div>
                        )}

                        {/* Date */}
                        <input
                            type="date"
                            value={data.date}
                            onChange={e => setData('date', e.target.value)}
                            className="w-full mt-3 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:border-teal-500 outline-none"
                        />
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <span className="text-4xl mb-2">🛒</span>
                                <p>কার্ট খালি</p>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.product_id} className="p-2 bg-gray-700/50 rounded-lg group animate-fade-in-left">
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-teal-400">৳ {item.unit_price} x {item.quantity}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                className="w-6 h-6 rounded bg-gray-600 text-white hover:bg-gray-500 flex items-center justify-center"
                                            >-</button>
                                            <span className="text-white text-sm font-bold w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                className="w-6 h-6 rounded bg-gray-600 text-white hover:bg-gray-500 flex items-center justify-center"
                                            >+</button>
                                        </div>
                                        <div className="text-right min-w-[60px]">
                                            <p className="text-sm font-bold text-white">৳ {item.total_price}</p>
                                            <button
                                                onClick={() => removeFromCart(item.product_id)}
                                                className="text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >মুছে ফেলুন</button>
                                        </div>
                                    </div>
                                    {/* Warranty Input Row */}
                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-600/50">
                                        <span className="text-xs text-gray-400">🛡️ ওয়ারেন্টি:</span>
                                        <input
                                            type="number"
                                            min="0"
                                            value={item.warranty_days || ''}
                                            onChange={e => updateWarranty(item.product_id, parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                            className="w-14 px-2 py-1 rounded bg-gray-600 border border-gray-500 text-white text-xs text-center focus:border-teal-500 outline-none"
                                        />
                                        <span className="text-xs text-gray-400">দিন</span>
                                        {item.warranty_days > 0 && (
                                            <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded-full ml-auto">
                                                ✓ {item.warranty_days} দিন
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer: Calculations & Submit */}
                    <div className="p-4 bg-gray-900 border-t border-gray-700 space-y-3 shadow-2xl">

                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between text-gray-400">
                                <span>উপমোট</span>
                                <span>৳ {data.subtotal}</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-400">
                                <span>ছাড়</span>
                                <input
                                    type="number"
                                    value={data.discount}
                                    onChange={e => setData('discount', Number(e.target.value))}
                                    className="w-20 px-2 py-1 rounded bg-gray-800 border-gray-700 text-right text-xs text-white focus:border-teal-500 outline-none"
                                />
                            </div>
                            <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-700">
                                <span>সর্বমোট</span>
                                <span>৳ {data.total_amount}</span>
                            </div>
                        </div>

                        {/* Payment Toggle */}
                        <div className="flex p-1 bg-gray-800 rounded-lg">
                            <button
                                type="button"
                                onClick={() => { setActiveTab('cash'); setData('paid_amount', data.total_amount); }}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'cash' ? 'bg-teal-600 text-white shadow' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                💵 নগদ
                            </button>
                            <button
                                type="button"
                                onClick={() => { setActiveTab('due'); setData('paid_amount', 0); }}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'due' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                📝 বাকি
                            </button>
                        </div>

                        {activeTab === 'due' && (
                            <div className="flex justify-between items-center text-gray-400 text-sm">
                                <span>জমা দিচ্ছেন</span>
                                <input
                                    type="number"
                                    value={data.paid_amount}
                                    onChange={e => setData('paid_amount', Number(e.target.value))}
                                    className="w-24 px-2 py-1 rounded bg-gray-800 border-gray-700 text-right text-white focus:border-teal-500 outline-none"
                                />
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={processing || cart.length === 0}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-bold shadow-lg shadow-teal-500/20 transform hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {processing && <span className="animate-spin">⏳</span>}
                            <span>✅ বিল তৈরি করুন</span>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
