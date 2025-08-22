import React from 'react';
import {  HiRefresh } from 'react-icons/hi';
import styles from './ErrorAlert.module.css';
import { HiExclamationTriangle } from 'react-icons/hi2';

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onRetry }) => {
  return (
    <div className={styles.container}>
      <div className={styles.errorCard}>
        <div className={styles.errorHeader}>
          <div className={styles.errorIcon}>
            <HiExclamationTriangle />
          </div>
          <div className={styles.errorContent}>
            <h3 className={styles.errorTitle}>Error al cargar los datos</h3>
            <p className={styles.errorMessage}>{message}</p>
          </div>
        </div>
        
        <div className={styles.errorActions}>
          <button 
            onClick={onRetry}
            className={styles.retryButton}
          >
            <HiRefresh />
            Reintentar
          </button>
        </div>
        
        <div className={styles.errorSuggestions}>
          <h4 className={styles.suggestionsTitle}>Posibles soluciones:</h4>
          <ul className={styles.suggestionsList}>
            <li>Verifique su conexión a internet</li>
            <li>Actualice la página y vuelva a intentar</li>
            <li>Contacte al administrador si el problema persiste</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorAlert;