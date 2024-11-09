import { useEffect, useState } from 'react';
import { ResponseDto, WarehouseDto } from '@dto';
import { warehouseService } from '../services/warehouse.service';

export const useDisplayWarehouses = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [warehouses, setWarehouses] = useState<WarehouseDto[]>([]);

    const fetchAllWarehouses = async () => {
        setIsLoading(true);

        const response: ResponseDto<WarehouseDto[]> = await warehouseService.fetchAllWarehouses();

        console.log('HOOKSDSD', response.body);

        if (response.statusCode !== 200) {
            throw new Error('Failed to fetch warehouses');
        }

        setWarehouses(response.body);
    };

    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    return { warehouses, isLoading, fetchAllWarehouses };
};
