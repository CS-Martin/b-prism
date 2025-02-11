import { useEffect, useState } from 'react';
import {
    CreateDispensingPointDto,
    CreateWarehouseDto,
    DispensingPointDto,
    RescuePostDto,
    ResponseDto,
    UpdateDispensingPointDto,
    UpdateWarehouseDto,
    WarehouseAddressDto,
    WarehouseDto,
} from '@dto';
import { warehouseService } from '../services/warehouse.service';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { dispensingPointService } from '../services/dispensing-point.service';
import { mapboxService } from '../services/mapbox.api.service';
import { rescuePostService } from '../services/rescue-post.service';

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

    const createWarehouse = async (data: CreateWarehouseDto, author: string) => {
        await warehouseService.create(data, author);

        toast({
            title: 'Success!',
            description: `The warehouse ${data.name} has been created successfully`,
            variant: 'success',
        });
    };

    return { createWarehouse };
};

export const useUpdateWarehouse = () => {
    const { toast } = useToast();

    const updateWarehouse = async (id: string, data: UpdateWarehouseDto, author: string) => {
        await warehouseService.update(id, data, author);

        toast({
            title: 'Success!',
            description: `The warehouse ${data.name} has been updated successfully`,
            variant: 'success',
        });
    };

    return { updateWarehouse };
};

export const useDeleteWarehouse = () => {
    const { toast } = useToast();

    const deleteWarehouse = async (id: string, author: string) => {
        await warehouseService.delete(id, author);

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

export const useFindOneDispensingPoint = (id: string) => {
    const [dispensingPoint, setDispensingPoint] = useState<DispensingPointDto>({} as DispensingPointDto);

    const fetchOneDispensingPoint = async () => {
        const response: ResponseDto<DispensingPointDto> = await dispensingPointService.findOne(id);

        if (response.statusCode !== 200) {
            throw new Error('Failed to fetch dispensing point');
        }

        setDispensingPoint(response.body);
    };

    useEffect(() => {
        fetchOneDispensingPoint();
    }, [id]);

    return { dispensingPoint, fetchOneDispensingPoint };
};

export const useCreateDispensingPoint = () => {
    const { toast } = useToast();

    const createDispensingPoint = async (data: CreateDispensingPointDto, author: string) => {
        await dispensingPointService.create(
            {
                ...data,
                capacity: Number(data.capacity),
            },
            author,
        );

        toast({
            title: 'Success!',
            description: `The dispensing point ${data.name} has been created successfully`,
            variant: 'success',
        });
    };

    return { createDispensingPoint };
};

export const useUpdateDispensingPoint = () => {
    const { toast } = useToast();

    const updateDispensingPoint = async (id: string, data: UpdateDispensingPointDto, author: string) => {
        await dispensingPointService.update(id, data, author);

        toast({
            title: 'Success!',
            description: `The dispensing point ${data.name} has been updated successfully`,
            variant: 'success',
        });
    };

    return { updateDispensingPoint };
};

export const useDeleteDispensingPoint = () => {
    const { toast } = useToast();

    const deleteDispensingPoint = async (id: string, author: string) => {
        await dispensingPointService.delete(id, author);

        toast({
            title: 'Dispensing point deleted successfully!',
            variant: 'success',
        });
    };

    return { deleteDispensingPoint };
};

export const useDisplayRescuePosts = () => {
    const [rescuePosts, setRescuePosts] = useState<RescuePostDto[]>([]);

    const fetchAllRescuePosts = async () => {
        const response: ResponseDto<RescuePostDto[]> = await rescuePostService.findAll();

        if (response.statusCode !== 200) {
            throw new Error('Failed to fetch rescue posts');
        }

        setRescuePosts(response.body);
    };

    useEffect(() => {
        fetchAllRescuePosts();
    }, []);

    return { rescuePosts };
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
