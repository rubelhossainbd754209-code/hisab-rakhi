import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export default function Card({
    children,
    className = '',
    hover = false,
    padding = 'md',
    onClick,
}: CardProps) {
    const Component = onClick ? 'button' : 'div';

    return (
        <Component
            onClick={onClick}
            className={`
                bg-white dark:bg-gray-800 rounded-2xl shadow-card
                transition-all duration-300
                ${paddingClasses[padding]}
                ${hover ? 'hover:shadow-elevated hover:-translate-y-1 cursor-pointer' : ''}
                ${onClick ? 'text-left w-full' : ''}
                ${className}
            `}
        >
            {children}
        </Component>
    );
}

// Card Header Component
interface CardHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    className?: string;
}

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
    return (
        <div className={`flex items-start justify-between mb-4 ${className}`}>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}

// Stat Card Component
interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    iconBgColor?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatCard({
    title,
    value,
    icon,
    iconBgColor = 'bg-primary-100 dark:bg-primary-900/30',
    trend,
    className = '',
}: StatCardProps) {
    return (
        <Card className={`flex items-center gap-4 ${className}`}>
            <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${iconBgColor}`}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {value}
                </p>
                {trend && (
                    <p
                        className={`text-sm mt-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'
                            }`}
                    >
                        {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </p>
                )}
            </div>
        </Card>
    );
}
