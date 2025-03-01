import { useEffect, useState } from 'react';
import { CreateWarehouseDto, ResponseDto, UpdateWarehouseDto, WarehouseAddressDto, WarehouseDto } from '@dto';
import { warehouseService } from '../services/warehouse.service';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { mapboxService } from '../services/mapbox.api.service';

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

export const useFindOneWarehouse = (id: string) => {
    const [warehouse, setWarehouse] = useState<WarehouseDto>({} as WarehouseDto);

    const fetchOneWarehouse = async () => {
        const response: ResponseDto<WarehouseDto> = await warehouseService.findOne(id);

        if (response.statusCode !== 200) {
            throw new Error('Failed to fetch warehouse');
        }

        setWarehouse(response.body);
    };

    useEffect(() => {
        fetchOneWarehouse();
    }, [id]);

    return { warehouse, fetchOneWarehouse };
};

export const useCreateWarehouse = () => {
    const { toast } = useToast();

    const createWarehouse = async (data: CreateWarehouseDto, author: string, accessToken: string) => {
        try {
            await warehouseService.create(data, author, accessToken);

            toast({
                title: 'Success!',
                description: `The warehouse "${data.name}" has been created successfully.`,
                variant: 'success',
            });
        } catch (error: any) {
            console.error('Error creating warehouse:', error);

            const errorMessage = error.message || 'Failed to create the warehouse. Please try again.';

            toast({
                title: 'Error!',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    };

    return { createWarehouse };
};

export const useUpdateWarehouse = () => {
    const { toast } = useToast();

    const updateWarehouse = async (id: string, data: UpdateWarehouseDto, author: string, accessToken: string) => {
        try {
            await warehouseService.update(id, data, author, accessToken);

            toast({
                title: 'Success!',
                description: `The warehouse ${data.name} has been updated successfully`,
                variant: 'success',
            });
        } catch (error: any) {
            console.error('Error creating warehouse:', error);

            const errorMessage = error.message || 'Failed to update the warehouse. Please try again.';

            toast({
                title: 'Error!',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    };

    return { updateWarehouse };
};

export const useDeleteWarehouse = () => {
    const { toast } = useToast();

    const deleteWarehouse = async (id: string, author: string, accessToken: string) => {
        try {
            await warehouseService.delete(id, author, accessToken);

            toast({
                title: 'Warehouse deleted successfully!',
                variant: 'success',
            });
        } catch (error: any) {
            console.error('Error creating warehouse:', error);

            const errorMessage = error.message || 'Failed to delete the warehouse. Please try again.';

            toast({
                title: 'Error!',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    };

    return { deleteWarehouse };
};

/**
 * @description Hooks for address
 */

export const useGetAddress = () => {
    const [address, setAddress] = useState<WarehouseAddressDto>({} as WarehouseAddressDto);

    const getAddress = async (longitude: string, latitude: string) => {
        const response = await mapboxService.reverse_geocoding(longitude, latitude);
        const data = await response?.json();

        if (data.features && data.features.length > 0) {
            const properties = data.features[0]?.properties.context || {};

            const street = properties.street?.name || '';
            const post_code = properties.postcode?.name || '';
            const locality = properties.locality?.name || '';
            const place = properties.place?.name || '';
            const region = properties.region?.name || '';
            const country = properties.country?.name || '';

            setAddress({ street, post_code, locality, place, region, country });
        } else {
            setAddress({} as WarehouseAddressDto);
        }
    };

    return { getAddress, address };
};
