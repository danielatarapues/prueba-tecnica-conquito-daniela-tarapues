// components/Dashboard/StatsOverview/StatsOverview.tsx
import React from 'react';
import { HiUsers, HiBriefcase, HiClock, HiTrendingUp } from 'react-icons/hi';
import type { DashboardStats } from '../../../types';
import styles from './StatsOverview.module.css';

interface StatsOverviewProps {
  stats: DashboardStats;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  trend?: string;
  color: 'primary' | 'success' | 'warning' | 'info';
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, color }) => {
  return (
    <div className={`${styles.statCard} ${styles[color]}`}>
      <div className={styles.statIcon}>
        {icon}
      </div>
      <div className={styles.statContent}>
        <div className={styles.statValue}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        <div className={styles.statLabel}>
          {label}
        </div>
        {trend && (
          <div className={styles.statTrend}>
            <HiTrendingUp className={styles.trendIcon} />
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  // Calcular estadísticas derivadas
  const totalPersons = stats.professionStats.reduce((sum, item) => sum + parseInt(item.count), 0);
  const totalProfessions = stats.professionStats.length;
  const totalAgeRanges = stats.ageRangeStats.length;
  
  // Calcular el mes con más registros
  const maxMonthlyCount = Math.max(...stats.monthlyStats.map(item => item.count));
  const peakMonth = stats.monthlyStats.find(item => item.count === maxMonthlyCount);
  const peakMonthName = peakMonth ? 
    new Date(peakMonth.month + '-01').toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) 
    : 'N/A';

  // Calcular profesión más común
  const topProfession = stats.professionStats.reduce((prev, current) => 
    parseInt(prev.count) > parseInt(current.count) ? prev : current
  );

  // Calcular rango de edad más común
  const topAgeRange = stats.ageRangeStats.reduce((prev, current) => 
    parseInt(prev.count) > parseInt(current.count) ? prev : current
  );

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Resumen Ejecutivo</h2>
        <p className={styles.sectionSubtitle}>Métricas clave del sistema</p>
      </div>

      <div className={styles.statsGrid}>
        {/* Total de personas */}
        <StatCard
          icon={<HiUsers />}
          label="Total Personas"
          value={totalPersons}
          trend={`+${((totalPersons / Math.max(totalPersons, 1)) * 100).toFixed(0)}%`}
          color="primary"
        />

        {/* Total de profesiones */}
        <StatCard
          icon={<HiBriefcase />}
          label="Profesiones"
          value={totalProfessions}
          color="success"
        />

        {/* Rangos de edad */}
        <StatCard
          icon={<HiClock />}
          label="Rangos de Edad"
          value={totalAgeRanges}
          color="warning"
        />

        {/* Registros máximos por mes */}
        <StatCard
          icon={<HiTrendingUp />}
          label="Pico Mensual"
          value={maxMonthlyCount}
          trend={peakMonthName}
          color="info"
        />
      </div>

      {/* Información adicional */}
      <div className={styles.additionalInfo}>
        <div className={styles.infoCard}>
          <h3 className={styles.infoTitle}>Profesión Más Común</h3>
          <p className={styles.infoValue}>{topProfession.profession}</p>
          <span className={styles.infoDetail}>
            {topProfession.count} persona{parseInt(topProfession.count) !== 1 ? 's' : ''}
          </span>
        </div>

        <div className={styles.infoCard}>
          <h3 className={styles.infoTitle}>Rango de Edad Principal</h3>
          <p className={styles.infoValue}>{topAgeRange.age_range} años</p>
          <span className={styles.infoDetail}>
            {topAgeRange.count} persona{parseInt(topAgeRange.count) !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

    </div>
  );
};

export default StatsOverview;