// StatusBadge.tsx - Versión simplificada

interface StatusBadgeProps {
    status: 'active' | 'inactive';
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const isActive = status === 'active';

    const styles = isActive
        ? 'bg-green-500/15 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-900'
        : 'bg-gray-500/15 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-900';

    const text = isActive ? 'Activo' : 'Inactivo';

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none ${styles}`}
        >
            {text}
        </span>
    );
};
