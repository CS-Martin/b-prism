import { useEffect, useState } from 'react';
import {
    CreateDispensingPointDto,
    CreateWarehouseDto,
    DispensingPointDto,
    RescuePostDto,
    ResponseDto,
    UpdateDispensingPointDto,
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

export const useGetAddress = () => {
    const [address, setAddress] = useState<WarehouseAddressDto>({} as WarehouseAddressDto);

    const getAddress = async (longitude: string, latitude: string) => {
        const response = await mapboxService.reverse_geocoding(longitude, latitude);
        const data = await response?.json();

        if (data.features && data.features.length > 0) {
            const properties = data.features[0]?.properties.context || {};

            const street = properties.street?.name || '';
            const post_code = properties.postcode?.name || '';
            const locality = properties.place?.name || '';
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

export const useCreateWarehouse = () => {
    const { toast } = useToast();

    const createWarehouse = async (data: CreateWarehouseDto) => {
        await warehouseService.create(data);

        console.log(data);

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

    const createDispensingPoint = async (data: CreateDispensingPointDto) => {
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

export const useUpdateDispensingPoint = () => {
    const { toast } = useToast();

    const updateDispensingPoint = async (id: string, data: UpdateDispensingPointDto) => {
        await dispensingPointService.update(id, data);

        toast({
            title: 'Success!',
            description: `The dispensing point ${data.name} has been updated successfully`,
            variant: 'success',
        });
    };

    return { updateDispensingPoint };
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
