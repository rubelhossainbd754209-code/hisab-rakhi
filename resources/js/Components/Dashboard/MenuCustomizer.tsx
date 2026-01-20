import React, { useState } from 'react';

interface MenuItem {
    id: string;
    name: string;
    customName?: string;
    icon: string;
    href: string;
    isVisible: boolean;
    order: number;
}

interface MenuCustomizerProps {
    isOpen: boolean;
    onClose: () => void;
    items: MenuItem[];
    onSave: (items: MenuItem[]) => void;
}

export default function MenuCustomizer({ isOpen, onClose, items, onSave }: MenuCustomizerProps) {
    const [menuItems, setMenuItems] = useState<MenuItem[]>(items);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null);

    if (!isOpen) return null;

    const handleDragStart = (e: React.DragEvent, item: MenuItem) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, targetItem: MenuItem) => {
        e.preventDefault();
        if (!draggedItem || draggedItem.id === targetItem.id) return;

        const newItems = [...menuItems];
        const draggedIndex = newItems.findIndex(i => i.id === draggedItem.id);
        const targetIndex = newItems.findIndex(i => i.id === targetItem.id);

        newItems.splice(draggedIndex, 1);
        newItems.splice(targetIndex, 0, draggedItem);

        // Update order
        newItems.forEach((item, index) => {
            item.order = index;
        });

        setMenuItems(newItems);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const handleToggleVisibility = (id: string) => {
        setMenuItems(items => items.map(item =>
            item.id === id ? { ...item, isVisible: !item.isVisible } : item
        ));
    };

    const handleStartEdit = (item: MenuItem) => {
        setEditingId(item.id);
        setEditName(item.customName || item.name);
    };

    const handleSaveEdit = () => {
        if (editingId) {
            setMenuItems(items => items.map(item =>
                item.id === editingId ? { ...item, customName: editName } : item
            ));
            setEditingId(null);
            setEditName('');
        }
    };

    const handleResetName = (id: string) => {
        setMenuItems(items => items.map(item =>
            item.id === id ? { ...item, customName: undefined } : item
        ));
    };

    const handleSave = () => {
        onSave(menuItems);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-scale-in shadow-2xl border border-gray-700">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-700">
                    <h2 className="text-lg font-semibold text-white">মেনু কাস্টমাইজ</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-700 text-gray-400"
                    >
                        ✕
                    </button>
                </div>

                {/* Instructions */}
                <div className="px-5 py-3 bg-gray-700/50 border-b border-gray-700">
                    <p className="text-sm text-gray-400">
                        🔀 মেনু টেনে সাজান • ✏️ নাম পরিবর্তন • 👁️ লুকান/দেখান
                    </p>
                </div>

                {/* Menu Items */}
                <div className="p-5 space-y-2 max-h-[50vh] overflow-y-auto">
                    {menuItems.sort((a, b) => a.order - b.order).map(item => (
                        <div
                            key={item.id}
                            draggable
                            onDragStart={e => handleDragStart(e, item)}
                            onDragOver={e => handleDragOver(e, item)}
                            onDragEnd={handleDragEnd}
                            className={`
                                flex items-center gap-3 p-3 rounded-xl border transition-all cursor-move
                                ${draggedItem?.id === item.id
                                    ? 'border-green-500 bg-green-500/10'
                                    : 'border-gray-700 bg-gray-700/30 hover:bg-gray-700/50'
                                }
                                ${!item.isVisible ? 'opacity-50' : ''}
                            `}
                        >
                            {/* Drag Handle */}
                            <div className="text-gray-500 cursor-grab active:cursor-grabbing">
                                ⠿
                            </div>

                            {/* Icon */}
                            <span className="text-xl">{item.icon}</span>

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                                {editingId === item.id ? (
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        onBlur={handleSaveEdit}
                                        onKeyDown={e => e.key === 'Enter' && handleSaveEdit()}
                                        autoFocus
                                        className="w-full px-2 py-1 rounded bg-gray-600 border-0 text-white text-sm"
                                    />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-white truncate">
                                            {item.customName || item.name}
                                        </span>
                                        {item.customName && (
                                            <button
                                                onClick={() => handleResetName(item.id)}
                                                className="text-xs text-gray-500 hover:text-gray-300"
                                                title="ডিফল্ট নামে ফিরুন"
                                            >
                                                ↺
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                {/* Edit Name */}
                                <button
                                    onClick={() => handleStartEdit(item)}
                                    className="p-1.5 rounded hover:bg-gray-600 text-gray-400 hover:text-white"
                                    title="নাম পরিবর্তন"
                                >
                                    ✏️
                                </button>

                                {/* Toggle Visibility */}
                                <button
                                    onClick={() => handleToggleVisibility(item.id)}
                                    className={`p-1.5 rounded hover:bg-gray-600 ${item.isVisible ? 'text-green-400' : 'text-gray-500'
                                        }`}
                                    title={item.isVisible ? 'লুকান' : 'দেখান'}
                                >
                                    {item.isVisible ? '👁️' : '🙈'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl bg-gray-700 text-gray-300 font-medium hover:bg-gray-600 transition-colors"
                    >
                        বাতিল
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-2.5 rounded-xl text-white font-medium transition-colors"
                        style={{ backgroundColor: '#006A4E' }}
                    >
                        সেভ করুন
                    </button>
                </div>
            </div>
        </div>
    );
}
