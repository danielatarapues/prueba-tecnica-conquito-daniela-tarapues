// components/Toast/Toast.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { 
  HiCheckCircle, 
  HiXCircle, 
  HiInformationCircle,
  HiX 
} from 'react-icons/hi';
import { HiExclamationTriangle } from 'react-icons/hi2';
import styles from '../ToastManager/ToastManager.module.css';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, duration = 4000, onClose }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleClose = useCallback(() => {
    setIsRemoving(true);
    // Esperar a que termine la animación antes de llamar onClose
    setTimeout(() => {
      onClose();
    }, 300); // Duración de la animación slideOutRight
  }, [onClose]);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <HiCheckCircle />;
      case 'error':
        return <HiXCircle />;
      case 'warning':
        return <HiExclamationTriangle />;
      case 'info':
        return <HiInformationCircle />;
      default:
        return <HiInformationCircle />;
    }
  };

  return (
    <div 
      className={`${styles.toast} ${styles[type]} ${isRemoving ? styles.removing : ''}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.iconWrapper}>
        {getIcon()}
      </div>
      
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
      </div>
      
      <button
        className={styles.closeButton}
        onClick={handleClose}
        aria-label="Cerrar notificación"
        title="Cerrar"
      >
        <HiX />
      </button>
      
      {duration > 0 && !isRemoving && (
        <div 
          className={styles.progressBar}
          style={{ animationDuration: `${duration}ms` }}
        />
      )}
    </div>
  );
};

export default Toast;