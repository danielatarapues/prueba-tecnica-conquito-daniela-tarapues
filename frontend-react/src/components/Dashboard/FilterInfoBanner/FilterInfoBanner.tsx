// components/Dashboard/FilterInfoBanner/FilterInfoBanner.tsx
import React from 'react';
import { HiInformationCircle, HiX } from 'react-icons/hi';
import styles from './FilterInfoBanner.module.css';
import type { DashboardFiltersState } from '../DashboardFilters/DashboardFilters';

interface FilterInfoBannerProps {
  filters: DashboardFiltersState;
  totalRecords: number;
  filteredRecords: number;
  onClearFilters: () => void;
}

const FilterInfoBanner: React.FC<FilterInfoBannerProps> = ({
  filters,
  totalRecords,
  filteredRecords,
  onClearFilters
}) => {
  const hasActiveFilters = 
    filters.professionFilter.length > 0 ||
    filters.ageRangeFilter.length > 0 ||
    filters.monthRangeFilter.start ||
    filters.monthRangeFilter.end ||
    filters.searchTerm.trim() !== '';

  if (!hasActiveFilters) return null;

  const getFilterSummary = () => {
    const filterParts = [];

    if (filters.searchTerm) {
      filterParts.push(`Búsqueda: "${filters.searchTerm}"`);
    }

    if (filters.professionFilter.length > 0) {
      if (filters.professionFilter.length === 1) {
        filterParts.push(`Profesión: ${filters.professionFilter[0]}`);
      } else {
        filterParts.push(`${filters.professionFilter.length} profesiones seleccionadas`);
      }
    }

    if (filters.ageRangeFilter.length > 0) {
      if (filters.ageRangeFilter.length === 1) {
        filterParts.push(`Edad: ${filters.ageRangeFilter[0]} años`);
      } else {
        filterParts.push(`${filters.ageRangeFilter.length} rangos de edad seleccionados`);
      }
    }

    if (filters.monthRangeFilter.start || filters.monthRangeFilter.end) {
      if (filters.monthRangeFilter.start && filters.monthRangeFilter.end) {
        const startMonth = new Date(filters.monthRangeFilter.start + '-01').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        const endMonth = new Date(filters.monthRangeFilter.end + '-01').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        filterParts.push(`Período: ${startMonth} - ${endMonth}`);
      } else if (filters.monthRangeFilter.start) {
        const startMonth = new Date(filters.monthRangeFilter.start + '-01').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        filterParts.push(`Desde: ${startMonth}`);
      } else if (filters.monthRangeFilter.end) {
        const endMonth = new Date(filters.monthRangeFilter.end + '-01').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
        filterParts.push(`Hasta: ${endMonth}`);
      }
    }

    return filterParts.join(' • ');
  };

  const percentageReduction = totalRecords > 0 ? ((totalRecords - filteredRecords) / totalRecords * 100).toFixed(1) : '0';

  return (
    <div className={styles.banner}>
      <div className={styles.bannerContent}>
        <div className={styles.infoSection}>
          <HiInformationCircle className={styles.infoIcon} />
          <div className={styles.infoText}>
            <div className={styles.mainInfo}>
              <strong>Filtros aplicados:</strong> {getFilterSummary()}
            </div>
            <div className={styles.statsInfo}>
              Mostrando {filteredRecords} de {totalRecords} registros
              {totalRecords !== filteredRecords && (
                <span className={styles.reduction}>
                  ({percentageReduction}% filtrado)
                </span>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={onClearFilters}
          className={styles.clearButton}
          title="Limpiar todos los filtros"
        >
          <HiX />
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default FilterInfoBanner;