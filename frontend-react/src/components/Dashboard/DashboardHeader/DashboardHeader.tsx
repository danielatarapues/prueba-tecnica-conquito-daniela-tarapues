import React from 'react';
import { HiChartBar, HiRefresh } from 'react-icons/hi';
import styles from './DashboardHeader.module.css';

interface DashboardHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  onRefresh, 
  refreshing 
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.headerText}>
          <div className={styles.titleSection}>
            <HiChartBar className={styles.titleIcon} />
            <h1>Dashboard Analítico</h1>
          </div>
          <p>Visualiza las estadísticas y métricas de personas registradas</p>
        </div>
        
        <div className={styles.headerActions}>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className={styles.refreshButton}
            title="Actualizar datos"
          >
            <HiRefresh className={`${styles.refreshIcon} ${refreshing ? styles.spinning : ''}`} />
            {refreshing ? 'Actualizando...' : 'Actualizar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;