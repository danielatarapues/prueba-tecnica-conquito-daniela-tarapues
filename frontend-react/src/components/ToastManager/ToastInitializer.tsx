import React from 'react';
import { useToast } from '../../hooks/useToast';
import { setGlobalToast, clearGlobalToast } from '../../utils/toast';

export const ToastInitializer: React.FC = () => {
  const { showToast } = useToast();
  
  React.useEffect(() => {
    setGlobalToast(showToast);
    return () => clearGlobalToast();
  }, [showToast]);
  
  return null;
};