import React, { useState } from 'react';

interface QuickAction {
    id: string;
    name: string;
    customName?: string;
    icon: string;
    href: string;
    color: string;
    isVisible: boolean;
    order: number;
}

interface QuickActionsCustomizerProps {
    isOpen: boolean;
    onClose: () => void;
    actions: QuickAction[];
    onSave: (actions: QuickAction[]) => void;
}

export default function QuickActionsCustomizer({ isOpen, onClose, actions, onSave }: QuickActionsCustomizerProps) {
    const [quickActions, setQuickActions] = useState<QuickAction[]>(actions);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    if (!isOpen) return null;

    const visibleCount = quickActions.filter(a => a.isVisible).length;

    const handleToggleVisibility = (id: string) => {
        const action = quickActions.find(a => a.id === id);
        if (!action) return;

        // Don't allow more than 4 visible
        if (!action.isVisible && visibleCount >= 4) {
            return;
        }

        setQuickActions(actions => actions.map(a =>
            a.id === id ? { ...a, isVisible: !a.isVisible } : a
        ));
    };

    const handleStartEdit = (action: QuickAction) => {
        setEditingId(action.id);
        setEditName(action.customName || action.name);
    };

    const handleSaveEdit = () => {
        if (editingId) {
            setQuickActions(actions => actions.map(a =>
                a.id === editingId ? { ...a, customName: editName } : a
            ));
            setEditingId(null);
            setEditName('');
        }
    };

    const moveAction = (id: string, direction: 'up' | 'down') => {
        const index = quickActions.findIndex(a => a.id === id);
        if (index === -1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= quickActions.length) return;

        const newActions = [...quickActions];
        [newActions[index], newActions[newIndex]] = [newActions[newIndex], newActions[index]];
        newActions.forEach((a, i) => a.order = i);
        setQuickActions(newActions);
    };

    const handleSave = () => {
        onSave(quickActions);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-gray-800 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-scale-in shadow-2xl border border-gray-700">
                <div className="flex items-center justify-between p-5 border-b border-gray-700">
                    <h2 className="text-lg font-semibold text-white">দ্রুত কাজ কাস্টমাইজ</h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-700 text-gray-400">✕</button>
                </div>

                <div className="px-5 py-3 bg-gray-700/50 border-b border-gray-700">
                    <p className="text-sm text-gray-400">
                        সর্বোচ্চ ৪টি দ্রুত কাজ সিলেক্ট করুন ({visibleCount}/4)
                    </p>
                </div>

                <div className="p-5 space-y-2 max-h-[50vh] overflow-y-auto">
                    {quickActions.sort((a, b) => a.order - b.order).map((action, index) => (
                        <div
                            key={action.id}
                            className={`
                                flex items-center gap-3 p-3 rounded-xl border transition-all
                                ${action.isVisible
                                    ? 'border-green-500/50 bg-green-500/10'
                                    : 'border-gray-700 bg-gray-700/30'
                                }
                            `}
                        >
                            {/* Move Buttons */}
                            <div className="flex flex-col gap-0.5">
                                <button
                                    onClick={() => moveAction(action.id, 'up')}
                                    disabled={index === 0}
                                    className="text-xs text-gray-500 hover:text-white disabled:opacity-30"
                                >
                                    ▲
                                </button>
                                <button
                                    onClick={() => moveAction(action.id, 'down')}
                                    disabled={index === quickActions.length - 1}
                                    className="text-xs text-gray-500 hover:text-white disabled:opacity-30"
                                >
                                    ▼
                                </button>
                            </div>

                            {/* Icon */}
                            <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-lg`}>
                                {action.icon}
                            </div>

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                                {editingId === action.id ? (
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
                                    <span className="text-white truncate block">
                                        {action.customName || action.name}
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleStartEdit(action)}
                                    className="p-1.5 rounded hover:bg-gray-600 text-gray-400"
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={() => handleToggleVisibility(action.id)}
                                    className={`p-1.5 rounded hover:bg-gray-600 ${action.isVisible ? 'text-green-400' : 'text-gray-500'
                                        }`}
                                    disabled={!action.isVisible && visibleCount >= 4}
                                >
                                    {action.isVisible ? '✓' : '○'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-5 border-t border-gray-700 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl bg-gray-700 text-gray-300 font-medium hover:bg-gray-600"
                    >
                        বাতিল
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-2.5 rounded-xl text-white font-medium"
                        style={{ backgroundColor: '#006A4E' }}
                    >
                        সেভ করুন
                    </button>
                </div>
            </div>
        </div>
    );
}
