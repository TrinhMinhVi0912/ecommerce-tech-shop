// src/context/ToastContext.jsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const ToastContext = createContext();

const toastTypes = {
    success: {
        icon: CheckCircle,
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        iconColor: 'text-green-500',
    },
    error: {
        icon: AlertCircle,
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        iconColor: 'text-red-500',
    },
    warning: {
        icon: AlertTriangle,
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        iconColor: 'text-yellow-500',
    },
    info: {
        icon: Info,
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        iconColor: 'text-blue-500',
    },
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type, duration }]);

        // Tự động xóa sau duration
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const success = useCallback((message, duration) => {
        showToast(message, 'success', duration);
    }, [showToast]);

    const error = useCallback((message, duration) => {
        showToast(message, 'error', duration);
    }, [showToast]);

    const warning = useCallback((message, duration) => {
        showToast(message, 'warning', duration);
    }, [showToast]);

    const info = useCallback((message, duration) => {
        showToast(message, 'info', duration);
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, warning, info, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

// Toast Container
const ToastContainer = ({ toasts, removeToast }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 max-w-md w-full pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
};

// Toast Item
const ToastItem = ({ toast, onClose }) => {
    const { icon: Icon, bgColor, borderColor, textColor, iconColor } = toastTypes[toast.type] || toastTypes.info;

    // Tự động đóng sau duration
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, toast.duration || 3000);

        return () => clearTimeout(timer);
    }, [toast.duration, onClose]);

    return (
        <div
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${bgColor} ${borderColor} shadow-lg animate-slide-in-right`}
            role="alert"
        >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1">
                <p className={`text-sm font-medium ${textColor}`}>
                    {toast.message}
                </p>
            </div>
            <button
                onClick={onClose}
                className={`flex-shrink-0 ${textColor} hover:opacity-70 transition-opacity`}
                aria-label="Đóng thông báo"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};