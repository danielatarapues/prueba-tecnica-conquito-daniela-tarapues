import React, { useState, useCallback, type ReactNode } from 'react';
import { ToastContext } from './ToastContext';
import Toast from '../Toast/Toast';
import styles from './ToastManager.module.css';
import type { ToastData } from '../../types/index';

interface ToastProviderProps {
  children: ReactNode;
  maxToasts?: number; // Máximo número de toasts simultáneos
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  maxToasts = 5 
}) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info', 
    duration = 4000
  ) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastData = { id, message, type, duration };
    
    setToasts(prev => {
      // Si ya hay el máximo de toasts, remover el más antiguo
      if (prev.length >= maxToasts) {
        return [...prev.slice(1), newToast];
      }
      return [...prev, newToast];
    });
  }, [maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, clearAllToasts }}>
      {children}
      
      {/* Contenedor de toasts - Solo renderizar si hay toasts */}
      {toasts.length > 0 && (
        <div 
          className={styles.toastContainer}
          role="region"
          aria-label="Notificaciones"
          aria-live="polite"
        >
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};