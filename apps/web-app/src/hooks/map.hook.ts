import { useCallback, useEffect, useState } from 'react';
import { CreateWarehouseDto, ResponseDto, RoadNetworkDto, UpdateWarehouseDto, WarehouseAddressDto, WarehouseDto } from '@dto';
import { warehouseService } from '../services/warehouse.service';
import { toast, useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { mapboxService } from '../services/mapbox.api.service';
import { useProgress } from '@bprogress/next';

/**
 * @description Hooks for warehouses
 */

export const useDisplayWarehouses = () => {
    const { start, stop } = useProgress();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [warehouses, setWarehouses] = useState<WarehouseDto[]>([]);

    const fetchAllWarehouses = async () => {
        try {
            start();
            setIsLoading(true);

            const response: ResponseDto<WarehouseDto[]> = await warehouseService.fetchAllWarehouses();

            if (response.statusCode !== 200) {
                throw new Error('Failed to fetch warehouses');
            }

            setWarehouses(response.body);
        } catch (error: any) {
            console.error('Error creating warehouse:', error);

            const errorMessage = error.message || 'Failed to create the warehouse. Please try again.';

            toast({
                title: 'Error!',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            stop();
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAllWarehouses();
    }, []);

    return { isLoading, warehouses, fetchAllWarehouses };
};

export const useFindOneWarehouse = (id: string) => {
    const { start, stop } = useProgress();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [warehouse, setWarehouse] = useState<WarehouseDto>({} as WarehouseDto);

    const fetchOneWarehouse = async () => {
        try {
            start();
            setIsLoading(true);
            const response: WarehouseDto = await warehouseService.findOne(id);

            setWarehouse(response);
        } catch (error: any) {
            console.error('Error creating warehouse:', error);

            const errorMessage = error.message || 'Failed to create the warehouse. Please try again.';

            toast({
                title: 'Error!',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            stop();
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOneWarehouse();
    }, [id]);

    return { isLoading, warehouse, fetchOneWarehouse };
};

export const useCreateWarehouse = () => {
    const { start, stop } = useProgress();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const createWarehouse = async (data: CreateWarehouseDto, author: string, access_token: string): Promise<WarehouseDto | undefined> => {
        try {
            start();
            setIsLoading(false);
            const warehouse: WarehouseDto = await warehouseService.create(data, author, access_token);

            if (!warehouse) {
                throw new Error('Failed to create the warehouse');
            }

            toast({
                title: 'Success!',
                description: `The warehouse "${data.name}" has been created successfully.`,
                variant: 'success',
            });

            return warehouse;
        } catch (error: any) {
            console.error('Error creating warehouse:', error);

            const errorMessage = error.message || 'Failed to create the warehouse. Please try again.';

            toast({
                title: 'Error!',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            stop();
            setIsLoading(false);
        }
    };

    return { isLoading, createWarehouse };
};

export const useUpdateWarehouse = () => {
    const { start, stop } = useProgress();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const updateWarehouse = async (id: string, data: UpdateWarehouseDto, author: string, access_token: string) => {
        try {
            start();
            setIsLoading(true);
            await warehouseService.update(id, data, author, access_token);

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
        } finally {
            stop();
            setIsLoading(false);
        }
    };

    return { isLoading, updateWarehouse };
};

export const useDeleteWarehouse = () => {
    const { start, stop } = useProgress();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const deleteWarehouse = async (id: string, author: string, access_token: string) => {
        try {
            start();
            setIsLoading(true);

            await warehouseService.delete(id, author, access_token);

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
        } finally {
            stop();
            setIsLoading(false);
        }
    };

    return { isLoading, deleteWarehouse };
};

/**
 * @description Hooks for address
 */

export const useGetAddress = () => {
    const { start, stop } = useProgress();
    const [address, setAddress] = useState<WarehouseAddressDto>({} as WarehouseAddressDto);

    const getAddress = async (longitude: number, latitude: number) => {
        try {
            start();
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
        } catch (error) {
            console.error('Error fetching address:', error);

            throw new Error('Failed to fetch address');
        } finally {
            stop();
        }
    };

    return { getAddress, address };
};

/**
 * @description hook for getting directions
 */

export const useGetDirections = () => {
    const [directions, setDirections] = useState<GeoJSON.Feature<GeoJSON.LineString>[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const getDirections = useCallback(async (start: [number, number], destination: [number, number], damagedRoads: any, profile?: 'driving' | 'walking' | 'cycling') => {
        setIsLoading(true);

        try {
            const routes = await mapboxService.getDirections(start, destination, damagedRoads, profile);

            setDirections(routes);
        } catch (error) {
            console.error('Failed to fetch directions from Mapbox Direction API ');

            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return { directions, getDirections, isLoading };
};
