export interface Brand {
    id: number;
    logo:string;
    name: string;
    status: boolean;
}

export interface DataTableBrandProps {
    brands: Brand[];
    onBrandChange?: () => void;
}

export interface ActionsCellProps {
    row: any;
    onDelete: (id: number) => Promise<{ success: boolean; error?: string }>;
}

export interface BulkActionsProps {
    table: any;
    onDeleteMultiple: (ids: number[]) => Promise<{ success: boolean; error?: string }>;
}

export interface MobileBrandCardProps {
    brand: Brand;
    onDelete: (id: number) => Promise<{ success: boolean; error?: string }>;
}