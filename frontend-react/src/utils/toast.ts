import type { ToastType } from "../types";

// Función toast standalone para usar fuera de componentes
let globalShowToast: ((message: string, type: ToastType, duration?: number) => void) | undefined;

export const setGlobalToast = (showToastFn: (message: string, type: ToastType, duration?: number) => void) => {
  globalShowToast = showToastFn;
};

export const clearGlobalToast = () => {
  globalShowToast = undefined;
};

export const toast = {
  success: (message: string, duration?: number) => {
    if (globalShowToast) {
      globalShowToast(message, 'success', duration);
    } else {
      console.warn('Toast not initialized. Make sure ToastProvider is mounted.');
    }
  },
  error: (message: string, duration?: number) => {
    if (globalShowToast) {
      globalShowToast(message, 'error', duration);
    } else {
      console.warn('Toast not initialized. Make sure ToastProvider is mounted.');
    }
  },
  warning: (message: string, duration?: number) => {
    if (globalShowToast) {
      globalShowToast(message, 'warning', duration);
    } else {
      console.warn('Toast not initialized. Make sure ToastProvider is mounted.');
    }
  },
  info: (message: string, duration?: number) => {
    if (globalShowToast) {
      globalShowToast(message, 'info', duration);
    } else {
      console.warn('Toast not initialized. Make sure ToastProvider is mounted.');
    }
  },
};