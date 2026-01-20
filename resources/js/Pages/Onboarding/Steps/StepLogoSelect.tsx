import React, { useRef, useState } from 'react';
import { Button } from '@/Components/Common';

interface LogoItem {
    id: string;
    url: string;
    name: string;
}

interface StepLogoSelectProps {
    logoLibrary: LogoItem[];
    currentLogo: string | File | null;
    onSelect: (logo: string | File | null) => void;
    onNext: () => void;
    onBack: () => void;
}

// Default logo icons
const defaultLogos: LogoItem[] = [
    { id: 'logo1', url: '', name: '🏪' },
    { id: 'logo2', url: '', name: '🛒' },
    { id: 'logo3', url: '', name: '🏬' },
    { id: 'logo4', url: '', name: '🏢' },
    { id: 'logo5', url: '', name: '🎯' },
    { id: 'logo6', url: '', name: '⭐' },
    { id: 'logo7', url: '', name: '💼' },
    { id: 'logo8', url: '', name: '🎨' },
    { id: 'logo9', url: '', name: '🔷' },
    { id: 'logo10', url: '', name: '🔶' },
    { id: 'logo11', url: '', name: '💎' },
    { id: 'logo12', url: '', name: '🌟' },
];

export default function StepLogoSelect({
    logoLibrary,
    currentLogo,
    onSelect,
    onNext,
    onBack,
}: StepLogoSelectProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

    const displayLogos = logoLibrary.length > 0 ? logoLibrary : defaultLogos;

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file
            if (!file.type.startsWith('image/')) {
                alert('শুধুমাত্র ছবি আপলোড করুন');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                alert('ছবির সাইজ ২MB এর বেশি হওয়া যাবে না');
                return;
            }

            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setSelectedIconId(null);
            onSelect(file);
        }
    };

    const handleIconSelect = (logo: LogoItem) => {
        setSelectedIconId(logo.id);
        setPreviewUrl(null);
        onSelect(logo.url || logo.name); // Use emoji as fallback
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        setSelectedIconId(null);
        onSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="animate-slide-up">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-900/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    🎨
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    আপনার ব্যবসার লোগো
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    আইকন বেছে নিন অথবা নিজের লোগো আপলোড করুন
                </p>
            </div>

            {/* Current Selection Preview */}
            {(previewUrl || selectedIconId) && (
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-2xl border-4 border-primary-500 overflow-hidden bg-white dark:bg-gray-700 flex items-center justify-center">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Logo preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-5xl">
                                    {displayLogos.find((l) => l.id === selectedIconId)?.name}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={handleRemove}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Upload Button */}
            <div className="flex justify-center mb-8">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="logo-upload"
                />
                <label
                    htmlFor="logo-upload"
                    className="flex items-center gap-3 px-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all"
                >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-600 dark:text-gray-300 font-medium">
                        নিজের লোগো আপলোড করুন
                    </span>
                </label>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    অথবা আইকন বেছে নিন
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            </div>

            {/* Icon Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                {displayLogos.map((logo) => (
                    <button
                        key={logo.id}
                        onClick={() => handleIconSelect(logo)}
                        className={`
                            w-full aspect-square rounded-xl border-2 transition-all duration-200
                            flex items-center justify-center text-3xl
                            hover:scale-110 hover:shadow-card
                            ${selectedIconId === logo.id
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                            }
                        `}
                    >
                        {logo.url ? (
                            <img src={logo.url} alt="" className="w-10 h-10 object-contain" />
                        ) : (
                            logo.name
                        )}
                    </button>
                ))}
            </div>

            {/* Skip Info */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
                💡 লোগো পরে যোগ করতে পারবেন। এই ধাপ স্কিপ করতে পারেন।
            </p>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
                <Button onClick={onBack} variant="ghost" size="lg" leftIcon={<span>←</span>}>
                    পেছনে
                </Button>
                <Button onClick={onNext} size="lg" rightIcon={<span>→</span>}>
                    পরবর্তী
                </Button>
            </div>
        </div>
    );
}
