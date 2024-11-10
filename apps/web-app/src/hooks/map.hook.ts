import { useEffect, useState } from 'react';
import { CreateWarehouseDto, ResponseDto, WarehouseDto } from '@dto';
import { warehouseService } from '../services/warehouse.service';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';

export const useDisplayWarehouses = () => {
    const [warehouses, setWarehouses] = useState<WarehouseDto[]>([]);

    const fetchAllWarehouses = async () => {
        const response: ResponseDto<WarehouseDto[]> = await warehouseService.fetchAllWarehouses();

        if (response.statusCode !== 200) {
            throw new Error('Failed to fetch warehouses');
        }

        setWarehouses(response.body);
    };

    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    return { warehouses, fetchAllWarehouses };
};

export const useCreateWarehouse = (warehouse: CreateWarehouseDto) => {
    const { toast } = useToast();

    const createWarehouse = async () => {
        await warehouseService.create(warehouse);

        toast({
            title: 'Success!',
            description: `The warehouse ${warehouse.name} has been created successfully`,
            variant: 'success',
        });
    };

    return { createWarehouse };
};

export const useDeleteWarehouse = (warehouseId: string) => {
    const { toast } = useToast();

    const deleteWarehouse = async () => {
        await warehouseService.delete(warehouseId);

        toast({
            title: 'Warehouse deleted successfully!',
            variant: 'success',
        });
    };

    return { deleteWarehouse };
};
