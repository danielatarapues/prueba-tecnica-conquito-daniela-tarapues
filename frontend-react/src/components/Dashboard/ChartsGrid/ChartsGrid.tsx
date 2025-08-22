import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import type { DashboardStats } from '../../../types';
import FilterInfoBanner from '../FilterInfoBanner/FilterInfoBanner';
import styles from './ChartsGrid.module.css';

// Importar íconos
import { HiBriefcase, HiClock, HiTrendingUp, HiChartBar } from 'react-icons/hi';
import type { DashboardFiltersState } from '../DashboardFilters/DashboardFilters';

// Registrar componentes de Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

interface ChartsGridProps {
    stats: DashboardStats;
    originalStats?: DashboardStats;
    filters?: DashboardFiltersState;
    onClearFilters?: () => void;
}

interface ChartCardProps {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    description?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, icon, children, description }) => {
    return (
        <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
                <div className={styles.chartTitleSection}>
                    <div className={styles.chartIcon}>
                        {icon}
                    </div>
                    <div>
                        <h3 className={styles.chartTitle}>{title}</h3>
                        {description && (
                            <p className={styles.chartDescription}>{description}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className={styles.chartContent}>
                {children}
            </div>
        </div>
    );
};

const ChartsGrid: React.FC<ChartsGridProps> = ({
    stats,
    originalStats,
    filters,
    onClearFilters
}) => {
    // Calcular totales para el banner de información
    const originalTotal = originalStats ?
        originalStats.professionStats.reduce((sum, item) => sum + parseInt(item.count), 0) : 0;
    const filteredTotal = stats.professionStats.reduce((sum, item) => sum + parseInt(item.count), 0);

    // Configuración para gráfico de barras (profesiones)
    const professionChartData = {
        labels: stats.professionStats.map(item => item.profession),
        datasets: [
            {
                label: 'Número de Personas',
                data: stats.professionStats.map(item => parseInt(item.count)),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(14, 165, 233, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(236, 72, 153, 1)',
                    'rgba(14, 165, 233, 1)',
                    'rgba(34, 197, 94, 1)',
                ],
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            },
        ],
    };

    const professionChartOptions: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#374151',
                bodyColor: '#374151',
                borderColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        size: 12,
                        weight: 500,
                    },
                    maxRotation: 45,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(156, 163, 175, 0.2)',
                },
                ticks: {
                    stepSize: 1,
                    color: '#6B7280',
                    font: {
                        size: 12,
                        weight: 500,
                    },
                },
            },
        },
    };

    // Configuración para gráfico de pastel (rangos de edad)
    const ageRangeChartData = {
        labels: stats.ageRangeStats.map(item => `${item.age_range} años`),
        datasets: [
            {
                label: 'Personas',
                data: stats.ageRangeStats.map(item => parseInt(item.count)),
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(236, 72, 153, 1)',
                ],
                borderWidth: 3,
            },
        ],
    };

    const ageRangeChartOptions: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 12,
                        weight: 500,
                    },
                    color: '#374151',
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#374151',
                bodyColor: '#374151',
                borderColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                    }
                }
            },
        },
    };

    // Configuración para gráfico de líneas (registros por mes)
    const monthlyChartData = {
        labels: stats.monthlyStats.map(item => {
            const date = new Date(item.month + '-01');
            return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
        }),
        datasets: [
            {
                label: 'Personas Registradas',
                data: stats.monthlyStats.map(item => item.count),
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3,
            },
        ],
    };

    const monthlyChartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#374151',
                bodyColor: '#374151',
                borderColor: 'rgba(59, 130, 246, 0.2)',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#6B7280',
                    font: {
                        size: 12,
                        weight: 500,
                    },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(156, 163, 175, 0.2)',
                },
                ticks: {
                    stepSize: 1,
                    color: '#6B7280',
                    font: {
                        size: 12,
                        weight: 500,
                    },
                },
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    return (
        <div className={styles.container}>
            {/* Banner de información de filtros */}
            {filters && originalStats && onClearFilters && (
                <FilterInfoBanner
                    filters={filters}
                    totalRecords={originalTotal}
                    filteredRecords={filteredTotal}
                    onClearFilters={onClearFilters}
                />
            )}

            <div className={styles.chartsGrid}>
                {/* Gráfico de barras - Profesiones */}
                <ChartCard
                    title="Distribución por Profesiones"
                    icon={<HiBriefcase />}
                    description="Cantidad de personas registradas por cada profesión"
                >
                    <div className={styles.chartWrapper}>
                        <Bar data={professionChartData} options={professionChartOptions} />
                    </div>
                </ChartCard>

                {/* Gráfico de pastel - Rangos de edad */}
                <ChartCard
                    title="Rangos de Edad"
                    icon={<HiClock />}
                    description="Distribución demográfica por grupos etarios"
                >
                    <div className={styles.chartWrapper}>
                        <Pie data={ageRangeChartData} options={ageRangeChartOptions} />
                    </div>
                </ChartCard>
            </div>

            {/* Gráfico de líneas - Registros por mes (ancho completo) */}
            <ChartCard
                title="Tendencia de Registros Mensuales"
                icon={<HiTrendingUp />}
                description="Evolución del número de personas registradas por mes"
            >
                <div className={styles.wideChartWrapper}>
                    <Line data={monthlyChartData} options={monthlyChartOptions} />
                </div>
            </ChartCard>

            {/* Información adicional de los gráficos */}
            <div className={styles.chartInsights}>
                <div className={styles.insightCard}>
                    <HiChartBar className={styles.insightIcon} />
                    <div className={styles.insightContent}>
                        <h4 className={styles.insightTitle}>Análisis de Datos</h4>
                        <p className={styles.insightText}>
                            Los gráficos muestran la distribución actual de {filteredTotal} personas
                            {originalTotal !== filteredTotal && ` (de ${originalTotal} total)`} registradas en {stats.professionStats.length} profesiones diferentes,
                            organizadas en {stats.ageRangeStats.length} grupos de edad.
                            {filters && originalStats && originalTotal !== filteredTotal && (
                                <span className={styles.filterNote}>
                                    {' '}Los datos han sido filtrados según los criterios seleccionados.
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartsGrid;