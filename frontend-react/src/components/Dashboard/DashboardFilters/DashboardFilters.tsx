import React, { useState } from 'react';
import { HiFilter, HiX, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import styles from './DashboardFilters.module.css';

export interface DashboardFiltersState {
    professionFilter: string[];
    ageRangeFilter: string[];
    monthRangeFilter: {
        start?: string;
        end?: string;
    };
    searchTerm: string;
}

interface DashboardFiltersProps {
    filters: DashboardFiltersState;
    onFiltersChange: (filters: DashboardFiltersState) => void;
    availableProfessions: string[];
    availableAgeRanges: string[];
    availableMonths: string[];
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
    filters,
    onFiltersChange,
    availableProfessions,
    availableAgeRanges,
    availableMonths,
}) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [expandedSections, setExpandedSections] = useState<{
        professions: boolean;
        ageRanges: boolean;
    }>({
        professions: false,
        ageRanges: false,
    });

    const updateFilter = (key: keyof DashboardFiltersState, value: unknown) => {
        onFiltersChange({
            ...filters,
            [key]: value,
        });
    };

    const toggleProfession = (profession: string) => {
        const newProfessions = filters.professionFilter.includes(profession)
            ? filters.professionFilter.filter(p => p !== profession)
            : [...filters.professionFilter, profession];
        updateFilter('professionFilter', newProfessions);
    };

    const toggleAgeRange = (ageRange: string) => {
        const newAgeRanges = filters.ageRangeFilter.includes(ageRange)
            ? filters.ageRangeFilter.filter(a => a !== ageRange)
            : [...filters.ageRangeFilter, ageRange];
        updateFilter('ageRangeFilter', newAgeRanges);
    };

    const toggleSection = (section: 'professions' | 'ageRanges') => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };


    const hasActiveFilters =
        filters.professionFilter.length > 0 ||
        filters.ageRangeFilter.length > 0 ||
        filters.monthRangeFilter.start ||
        filters.monthRangeFilter.end ||
        filters.searchTerm.trim() !== '';

    // Mostrar solo los primeros 3 elementos si no está expandido
    const getVisibleItems = (items: string[], expanded: boolean, limit: number = 3) => {
        return expanded ? items : items.slice(0, limit);
    };

    const hasMoreItems = (items: string[], limit: number = 3) => items.length > limit;

    // Función para formatear los meses disponibles
    const formatMonthOptions = () => {
        if (!availableMonths || availableMonths.length === 0) {
            return [];
        }

        // Ordenar los meses disponibles
        const sortedMonths = [...availableMonths].sort();
        
        return sortedMonths.map(month => {
            try {
                // month viene en formato YYYY-MM
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
                
                return {
                    value: month,
                    label: date.toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long'
                    })
                };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                // Fallback si hay error en el formateo
                return {
                    value: month,
                    label: month
                };
            }
        });
    };

    const monthOptions = formatMonthOptions();

    // Función para obtener meses válidos para "Hasta" basado en el mes seleccionado en "Desde"
    const getValidEndMonths = () => {
        if (!filters.monthRangeFilter.start) {
            return monthOptions;
        }

        // Solo mostrar meses que sean >= al mes de inicio
        return monthOptions.filter(option => option.value >= filters.monthRangeFilter.start!);
    };

    // Función para obtener meses válidos para "Desde" basado en el mes seleccionado en "Hasta"
    const getValidStartMonths = () => {
        if (!filters.monthRangeFilter.end) {
            return monthOptions;
        }

        // Solo mostrar meses que sean <= al mes de fin
        return monthOptions.filter(option => option.value <= filters.monthRangeFilter.end!);
    };

    return (
        <div className={styles.container}>
            <div className={styles.filtersHeader}>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={styles.headerToggle}
                >
                    <div className={styles.headerTitle}>
                        <HiFilter className={styles.filterIcon} />
                        <h3>Filtros</h3>
                        {hasActiveFilters && !isCollapsed && (
                            <span className={styles.activeFiltersCount}>
                                ({Object.values(filters).flat().filter(Boolean).length})
                            </span>
                        )}
                    </div>
                    {isCollapsed ? 
                        <HiChevronDown className={styles.headerChevron} /> : 
                        <HiChevronUp className={styles.headerChevron} />
                    }
                </button>
                
            </div>

            {/* Layout más compacto - Solo visible cuando no está colapsado */}
            {!isCollapsed && (
                <>
                    <div className={styles.filtersGrid}>
                        {/* Búsqueda - Ocupa toda la primera fila */}
                        <div className={styles.searchSection}>
                            <input
                                type="text"
                                placeholder="Buscar por nombre, apellido, profesión o dirección..."
                                value={filters.searchTerm}
                                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        {/* Segunda fila: Profesiones y Edades */}
                        <div className={styles.checkboxSection}>
                            <div className={styles.filterSection}>
                                <button
                                    onClick={() => toggleSection('professions')}
                                    className={styles.filterToggle}
                                >
                                    <span className={styles.filterLabel}>
                                        Profesiones
                                        {filters.professionFilter.length > 0 && (
                                            <span className={styles.filterCount}>({filters.professionFilter.length})</span>
                                        )}
                                    </span>
                                    {hasMoreItems(availableProfessions) && (
                                        expandedSections.professions 
                                            ? <HiChevronUp className={styles.chevronIcon} />
                                            : <HiChevronDown className={styles.chevronIcon} />
                                    )}
                                </button>
                                <div className={styles.compactCheckboxGroup}>
                                    {getVisibleItems(availableProfessions, expandedSections.professions).map((profession) => (
                                        <label key={profession} className={styles.compactCheckboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={filters.professionFilter.includes(profession)}
                                                onChange={() => toggleProfession(profession)}
                                                className={styles.compactCheckbox}
                                            />
                                            <span className={styles.compactCheckboxText}>{profession}</span>
                                        </label>
                                    ))}
                                    {hasMoreItems(availableProfessions) && !expandedSections.professions && (
                                        <button
                                            onClick={() => toggleSection('professions')}
                                            className={styles.showMoreButton}
                                        >
                                            +{availableProfessions.length - 3} más
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className={styles.filterSection}>
                                <button
                                    onClick={() => toggleSection('ageRanges')}
                                    className={styles.filterToggle}
                                >
                                    <span className={styles.filterLabel}>
                                        Rangos de Edad
                                        {filters.ageRangeFilter.length > 0 && (
                                            <span className={styles.filterCount}>({filters.ageRangeFilter.length})</span>
                                        )}
                                    </span>
                                    {hasMoreItems(availableAgeRanges) && (
                                        expandedSections.ageRanges 
                                            ? <HiChevronUp className={styles.chevronIcon} />
                                            : <HiChevronDown className={styles.chevronIcon} />
                                    )}
                                </button>
                                <div className={styles.compactCheckboxGroup}>
                                    {getVisibleItems(availableAgeRanges, expandedSections.ageRanges).map((ageRange) => (
                                        <label key={ageRange} className={styles.compactCheckboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={filters.ageRangeFilter.includes(ageRange)}
                                                onChange={() => toggleAgeRange(ageRange)}
                                                className={styles.compactCheckbox}
                                            />
                                            <span className={styles.compactCheckboxText}>{ageRange} años</span>
                                        </label>
                                    ))}
                                    {hasMoreItems(availableAgeRanges) && !expandedSections.ageRanges && (
                                        <button
                                            onClick={() => toggleSection('ageRanges')}
                                            className={styles.showMoreButton}
                                        >
                                            +{availableAgeRanges.length - 3} más
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tercera fila: Período */}
                        <div className={styles.periodSection}>
                            <label className={styles.filterLabel}>
                                Período de Registro
                                {(filters.monthRangeFilter.start || filters.monthRangeFilter.end) && (
                                    <span className={styles.filterCount}>(activo)</span>
                                )}
                            </label>
                            <div className={styles.compactDateRange}>
                                <select
                                    value={filters.monthRangeFilter.start || ''}
                                    onChange={(e) => updateFilter('monthRangeFilter', {
                                        ...filters.monthRangeFilter,
                                        start: e.target.value || undefined
                                    })}
                                    className={styles.compactMonthSelect}
                                >
                                    <option value="">Desde...</option>
                                    {getValidStartMonths().map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <span className={styles.dateSeparator}>→</span>
                                <select
                                    value={filters.monthRangeFilter.end || ''}
                                    onChange={(e) => updateFilter('monthRangeFilter', {
                                        ...filters.monthRangeFilter,
                                        end: e.target.value || undefined
                                    })}
                                    className={styles.compactMonthSelect}
                                >
                                    <option value="">Hasta...</option>
                                    {getValidEndMonths().map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {monthOptions.length > 0 && (
                                <div className={styles.helpText}>
                                    Disponible: {monthOptions[0]?.label} - {monthOptions[monthOptions.length - 1]?.label}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filtros activos - más compacto */}
                    {hasActiveFilters && (
                        <div className={styles.compactActiveFilters}>
                            <div className={styles.activeFiltersList}>
                                {filters.searchTerm && (
                                    <span className={styles.activeFilter}>
                                        🔍 "{filters.searchTerm}"
                                        <button
                                            onClick={() => updateFilter('searchTerm', '')}
                                            className={styles.removeFilter}
                                        >
                                            <HiX />
                                        </button>
                                    </span>
                                )}
                                {filters.professionFilter.map((profession) => (
                                    <span key={profession} className={styles.activeFilter}>
                                        💼 {profession}
                                        <button
                                            onClick={() => toggleProfession(profession)}
                                            className={styles.removeFilter}
                                        >
                                            <HiX />
                                        </button>
                                    </span>
                                ))}
                                {filters.ageRangeFilter.map((ageRange) => (
                                    <span key={ageRange} className={styles.activeFilter}>
                                        👥 {ageRange} años
                                        <button
                                            onClick={() => toggleAgeRange(ageRange)}
                                            className={styles.removeFilter}
                                        >
                                            <HiX />
                                        </button>
                                    </span>
                                ))}
                                {filters.monthRangeFilter.start && (
                                    <span className={styles.activeFilter}>
                                        📅 Desde: {monthOptions.find(opt => opt.value === filters.monthRangeFilter.start)?.label}
                                        <button
                                            onClick={() => updateFilter('monthRangeFilter', {
                                                ...filters.monthRangeFilter,
                                                start: undefined
                                            })}
                                            className={styles.removeFilter}
                                        >
                                            <HiX />
                                        </button>
                                    </span>
                                )}
                                {filters.monthRangeFilter.end && (
                                    <span className={styles.activeFilter}>
                                        📅 Hasta: {monthOptions.find(opt => opt.value === filters.monthRangeFilter.end)?.label}
                                        <button
                                            onClick={() => updateFilter('monthRangeFilter', {
                                                ...filters.monthRangeFilter,
                                                end: undefined
                                            })}
                                            className={styles.removeFilter}
                                        >
                                            <HiX />
                                        </button>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DashboardFilters;