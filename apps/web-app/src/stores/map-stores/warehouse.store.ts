import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { ResponseDto, WarehouseDto } from '@dto';
import { features } from 'process';
import { create } from 'zustand';
import { warehouseService } from '../../services/warehouse.service';

type WarehouseState = {
    warehouseGeoJson: { type: string; features: any[] };
    isLoading: boolean;
    fetchAllWarehouses: () => Promise<void>;
};

export const useWarehouseStore = create<WarehouseState>((set) => ({
    warehouseGeoJson: { type: 'FeatureCollection', features: [] },
    isLoading: false,

    fetchAllWarehouses: async () => {
        set({ isLoading: true });

        try {
            const response: ResponseDto<WarehouseDto[]> = await warehouseService.fetchAllWarehouses();

            if (response.statusCode !== 200) {
                throw new Error('Failed to fetch warehouses');
            }

            const warehouses = response.body;

            const warehouseGeoJson = {
                type: 'FeatureCollection',
                features: warehouses.map((w) => ({
                    type: 'Feature',
                    properties: {
                        id: w.id,
                        type: 'warehouse',
                        name: w.name,
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [w.longitude, w.latitude],
                    },
                })),
            };

            set({ warehouseGeoJson });
        } catch (error: any) {
            console.error('Error fetching warehouses:', error);

            toast({
                title: 'Error!',
                description: error.message || 'Failed to fetch warehouses. Please try again.',
                variant: 'destructive',
            });
        } finally {
            set({ isLoading: false });
        }
    },
}));
