import { useEffect, useState } from 'react';
import { CreateDispensingPointDto, CreateWarehouseDto, DispensingPointDto, ResponseDto, WarehouseDto } from '@dto';
import { warehouseService } from '../services/warehouse.service';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { dispensingPointService } from '../services/dispensing-point.service';
import { getServerSession } from 'next-auth';

/**
 * @description Hooks for warehouses
 */

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

export const useCreateWarehouse = (data: CreateWarehouseDto) => {
    const { toast } = useToast();

    const createWarehouse = async () => {
        await warehouseService.create(data);

        toast({
            title: 'Success!',
            description: `The warehouse ${data.name} has been created successfully`,
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

/**
 * @description Hooks for dispensing points
 */

export const useDisplayDispensingPoints = () => {
    const [dispensingPoints, setDispensingPoints] = useState<DispensingPointDto[]>([]);

    const fetchAllDispensingPoints = async () => {
        const response: ResponseDto<DispensingPointDto[]> = await dispensingPointService.fetchAllDispensingPoints();

        if (response.statusCode !== 200) {
            throw new Error('Failed to fetch dispensing points');
        }

        setDispensingPoints(response.body);
    };

    useEffect(() => {
        fetchAllDispensingPoints();
    }, []);

    return { dispensingPoints, fetchAllDispensingPoints };
};

export const useCreateDispensingPoint = (data: CreateDispensingPointDto) => {
    const { toast } = useToast();

    const createDispensingPoint = async () => {
        await dispensingPointService.create({
            ...data,
            capacity: Number(data.capacity),
        });

        toast({
            title: 'Success!',
            description: `The dispensing point ${data.name} has been created successfully`,
            variant: 'success',
        });
    };

    return { createDispensingPoint };
};

export const useDeleteDispensingPoint = (dispensingPointId: string) => {
    const { toast } = useToast();

    const deleteDispensingPoint = async () => {
        await dispensingPointService.delete(dispensingPointId);

        toast({
            title: 'Dispensing point deleted successfully!',
            variant: 'success',
        });
    };

    return { deleteDispensingPoint };
};
