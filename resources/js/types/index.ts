// User Types
export interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    role: 'super_admin' | 'admin' | 'user';
    email_verified_at?: string;
    avatar?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Business Types
export interface Business {
    id: string;
    user_id: number;
    template_id: string;
    name: string;
    phone?: string;
    address?: string;
    logo?: string;
    settings: BusinessSettings;
    subscription_type: 'free' | 'basic' | 'premium';
    subscription_expires?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    category?: Category;
    template?: Template;
}

export interface BusinessSettings {
    theme?: 'light' | 'dark' | 'system';
    currency?: string;
    date_format?: string;
    modules?: string[];
    quick_actions?: string[];
}

// Category Types
export interface Category {
    id: string;
    name_bn: string;
    name_en?: string;
    icon: string;
    description?: string;
    color?: string;
    is_active: boolean;
    sort_order: number;
    templates_count?: number;
    created_at: string;
    updated_at: string;
}

// Template Types
export interface Template {
    id: string;
    category_id: string;
    name_bn: string;
    name_en?: string;
    description?: string;
    modules: TemplateModule[];
    settings: TemplateSettings;
    preview_image?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    category?: Category;
}

export interface TemplateModule {
    id: string;
    name_bn: string;
    icon: string;
    is_default: boolean;
    is_required: boolean;
    sort_order: number;
}

export interface TemplateSettings {
    color_scheme?: string;
    layout?: 'sidebar' | 'top-nav';
    quick_actions?: QuickAction[];
}

export interface QuickAction {
    id: string;
    name_bn: string;
    icon: string;
    action: string;
    color?: string;
}

// Party Types
export interface Party {
    id: string;
    business_id: string;
    name: string;
    phone?: string;
    email?: string;
    address?: string;
    type: 'customer' | 'supplier' | 'both';
    balance: number;
    total_transactions?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Product Types
export interface Product {
    id: string;
    business_id: string;
    name: string;
    sku?: string;
    barcode?: string;
    description?: string;
    purchase_price: number;
    selling_price: number;
    stock: number;
    unit?: string;
    alert_quantity: number;
    category_name?: string;
    image?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Transaction Types
export interface Transaction {
    id: string;
    business_id: string;
    party_id?: string;
    type: 'income' | 'expense' | 'sale' | 'purchase' | 'payment_in' | 'payment_out';
    amount: number;
    description?: string;
    transaction_date: string;
    payment_method?: string;
    reference_no?: string;
    items?: TransactionItem[];
    party?: Party;
    created_at: string;
    updated_at: string;
}

export interface TransactionItem {
    product_id: string;
    product_name: string;
    quantity: number;
    unit_price: number;
    total: number;
}

// Invoice Types
export interface Invoice {
    id: string;
    business_id: string;
    party_id?: string;
    invoice_number: string;
    type: 'sale' | 'purchase';
    status: 'draft' | 'sent' | 'paid' | 'partial' | 'cancelled';
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paid_amount: number;
    due_amount: number;
    due_date?: string;
    notes?: string;
    items: InvoiceItem[];
    party?: Party;
    created_at: string;
    updated_at: string;
}

export interface InvoiceItem {
    product_id?: string;
    description: string;
    quantity: number;
    unit_price: number;
    discount: number;
    total: number;
}

// Dashboard Stats
export interface DashboardStats {
    today_income: number;
    today_expense: number;
    today_profit: number;
    total_receivable: number;
    total_payable: number;
    low_stock_count: number;
    pending_invoices: number;
    recent_transactions: Transaction[];
}

// Pagination Types
export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

// Inertia Page Props
export interface PageProps {
    auth: {
        user: User;
        business?: Business;
    };
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
    errors?: Record<string, string>;
}

// Onboarding Types
export interface OnboardingStep {
    id: number;
    name_bn: string;
    description_bn?: string;
    is_completed: boolean;
    is_current: boolean;
}

export interface OnboardingData {
    business_name: string;
    business_phone: string;
    business_address: string;
    category_id: string;
    template_id: string;
    logo: string | File | null;
    selected_modules: string[];
}
