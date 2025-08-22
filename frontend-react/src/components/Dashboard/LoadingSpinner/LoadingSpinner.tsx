// components/Dashboard/LoadingSpinner/LoadingSpinner.tsx
import React from 'react';
import { HiChartBar } from 'react-icons/hi';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner}>
          <div className={styles.spinnerInner}>
            <HiChartBar className={styles.spinnerIcon} />
          </div>
        </div>
        <div className={styles.loadingText}>
          <h3>Cargando Dashboard</h3>
          <p>Preparando estadísticas y gráficos...</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;