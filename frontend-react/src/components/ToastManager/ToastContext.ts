import { createContext } from 'react';
import type { ToastContextType } from '../../types/index';

export const ToastContext = createContext<ToastContextType | undefined>(undefined);