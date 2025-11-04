import * as React from 'react';

interface StatusBadgeProps {
    status: any;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    const getStatusStyles = (status: any) => {
        const statusStr = String(status).toLowerCase();

        switch (statusStr) {
            case 'active':
            case 'activo':
            case '1':
            case 'true':
                return 'bg-green-500/15 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-900';
            case 'inactive':
            case 'inactivo':
            case '0':
            case 'false':
                return 'bg-gray-500/15 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-900';
            case 'discontinued':
            case 'descontinuado':
                return 'bg-red-500/15 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-900';
            default:
                return 'bg-blue-500/15 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-900';
        }
    };

    const getStatusText = (status: any) => {
        if (status === null || status === undefined) return 'Desconocido';

        const statusStr = String(status).toLowerCase();

        switch (statusStr) {
            case 'active':
            case 'activo':
            case '1':
            case 'true':
                return 'Activo';
            case 'inactive':
            case 'inactivo':
            case '0':
            case 'false':
                return 'Inactivo';
            case 'discontinued':
            case 'descontinuado':
                return 'Descontinuado';
            default:
                return (
                    String(status).charAt(0).toUpperCase() +
                    String(status).slice(1)
                );
        }
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none ${getStatusStyles(status)}`}
        >
            {getStatusText(status)}
        </span>
    );
};