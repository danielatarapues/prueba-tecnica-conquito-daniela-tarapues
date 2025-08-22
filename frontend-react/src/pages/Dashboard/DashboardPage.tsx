import React, { useEffect, useState, useMemo, useCallback } from 'react';
import styles from './DashboardPage.module.css';

// Componentes del dashboard
import type { DashboardFiltersState } from '../../components/Dashboard/DashboardFilters/DashboardFilters';
import DashboardHeader from '../../components/Dashboard/DashboardHeader/DashboardHeader';
import LoadingSpinner from '../../components/Dashboard/LoadingSpinner/LoadingSpinner';
import ErrorAlert from '../../components/Dashboard/ErrorAlert/ErrorAlert';
import DashboardFilters from '../../components/Dashboard/DashboardFilters/DashboardFilters';
import StatsOverview from '../../components/Dashboard/StatsOverview/StatsOverview';
import ChartsGrid from '../../components/Dashboard/ChartsGrid/ChartsGrid';

// Importamos los íconos de react-icons
import { HiChartBar, HiRefresh } from 'react-icons/hi';

import type { DashboardStats } from '../../types';
import { useToast } from '../../hooks/useToast';
import personService from '../../services/api';

interface ApiError {
  response?: {
    data?: {
      details?: string[];
      error?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { showToast } = useToast();

  // Estado de filtros
  const [filters, setFilters] = useState<DashboardFiltersState>({
    professionFilter: [],
    ageRangeFilter: [],
    monthRangeFilter: {},
    searchTerm: '',
  });

  // Función para aplicar filtros a los datos - memoizada
  const applyFilters = useCallback((originalStats: DashboardStats): DashboardStats => {
    if (!originalStats) return originalStats;

    const filteredStats = { ...originalStats };

    // Filtrar profesiones
    if (filters.professionFilter.length > 0) {
      filteredStats.professionStats = filteredStats.professionStats.filter(item =>
        filters.professionFilter.includes(item.profession)
      );
    }

    // Filtrar rangos de edad
    if (filters.ageRangeFilter.length > 0) {
      filteredStats.ageRangeStats = filteredStats.ageRangeStats.filter(item =>
        filters.ageRangeFilter.includes(item.age_range)
      );
    }

    // Filtrar rangos de meses
    if (filters.monthRangeFilter.start || filters.monthRangeFilter.end) {
      filteredStats.monthlyStats = filteredStats.monthlyStats.filter(item => {
        const itemDate = new Date(item.month + '-01');
        const startDate = filters.monthRangeFilter.start ? new Date(filters.monthRangeFilter.start + '-01') : null;
        const endDate = filters.monthRangeFilter.end ? new Date(filters.monthRangeFilter.end + '-01') : null;

        if (startDate && itemDate < startDate) return false;
        if (endDate && itemDate > endDate) return false;
        return true;
      });
    }

    return filteredStats;
  }, [filters]);

  // Estadísticas filtradas usando useMemo para optimización
  const filteredStats = useMemo(() => {
    if (!stats) return null;
    return applyFilters(stats);
  }, [stats, applyFilters]);

  // Obtener listas para los filtros
  const filterOptions = useMemo(() => {
    if (!stats) return {
      professions: [],
      ageRanges: [],
      months: []
    };

    return {
      professions: stats.professionStats.map(item => item.profession),
      ageRanges: stats.ageRangeStats.map(item => item.age_range),
      months: stats.monthlyStats.map(item => item.month).sort()
    };
  }, [stats]);

  const loadStats = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await personService.getStats();
      setStats(data);
      setError(null);

      if (isRefresh) {
        showToast('Datos actualizados correctamente', 'success');
      }
    } catch (err) {
      console.error('Error cargando estadísticas:', err);

      const apiError = err as ApiError;
      let errorMessage = 'Error cargando estadísticas';

      if (apiError.response?.data?.details) {
        errorMessage = apiError.response.data.details.join(', ');
      } else if (apiError.response?.data?.error) {
        errorMessage = apiError.response.data.error;
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError(errorMessage);

      if (isRefresh) {
        showToast(errorMessage, 'error');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleRefresh = useCallback(() => {
    loadStats(true);
  }, [loadStats]);

  const handleFiltersChange = useCallback((newFilters: DashboardFiltersState) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      professionFilter: [],
      ageRangeFilter: [],
      monthRangeFilter: {},
      searchTerm: '',
    });
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <DashboardHeader
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className={styles.container}>
        <DashboardHeader
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
        <ErrorAlert
          message={error}
          onRetry={() => loadStats()}
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={styles.container}>
        <DashboardHeader
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
        <div className={styles.noDataAlert}>
          <div className={styles.noDataContent}>
            <HiChartBar className={styles.noDataIcon} />
            <h3>No hay datos disponibles</h3>
            <p>Comience registrando algunas personas para ver las estadísticas</p>
            <button
              onClick={() => loadStats()}
              className={styles.retryButton}
            >
              <HiRefresh />
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header del dashboard */}
      <DashboardHeader
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {/* Filtros debajo del header */}
      <div className={styles.filtersSection}>
        <DashboardFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          availableProfessions={filterOptions.professions}
          availableAgeRanges={filterOptions.ageRanges}
          availableMonths={filterOptions.months}
        />
      </div>

      {/* Layout principal */}
      <div className={styles.mainContent}>
        {/* Panel lateral con estadísticas rápidas */}
        <div className={styles.sidePanel}>
          <StatsOverview stats={filteredStats || stats} />
        </div>

        {/* Panel principal con gráficos */}
        <div className={styles.contentPanel}>
          <ChartsGrid
            stats={filteredStats || stats}
            originalStats={stats}
            filters={filters}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;