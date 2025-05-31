import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { ResponseDto, WarehouseDto } from '@dto';
import { create } from 'zustand';
import { warehouseService } from '../../services/warehouse.service';
import { parseErrorMessage } from 'libs/utils/src/lib/error-handler';

type WarehouseState = {
    warehouseGeoJson: { type: string; features: any[] };
    isLoading: boolean;
    fetchAllWarehouses: () => Promise<void>;
    addWarehouse: (newWarehouse: WarehouseDto) => void;
    removeWarehouse: (warehouseId: string) => void;
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
        } catch (error: unknown) {
            parseErrorMessage(error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Instead of fetching from the server, we can add the new warehouse to the store
    // This is useful for adding new warehouses without refreshing the page
    // Very nice zustand!!!
    addWarehouse: (newWarehouse: WarehouseDto) => {
        set((state) => {
            const newFeature = {
                type: 'Feature',
                properties: {
                    id: newWarehouse.id,
                    type: 'warehouse',
                    name: newWarehouse.name,
                },
                geometry: {
                    type: 'Point',
                    coordinates: [newWarehouse.longitude, newWarehouse.latitude],
                },
            };
            return {
                warehouseGeoJson: {
                    ...state.warehouseGeoJson,
                    features: [...state.warehouseGeoJson.features, newFeature],
                },
            };
        });
    },

    removeWarehouse: (warehouseId: string) => {
        set((state) => {
            const newFeatures = state.warehouseGeoJson.features.filter((feature) => feature.properties.id !== warehouseId);

            return {
                warehouseGeoJson: {
                    ...state.warehouseGeoJson,
                    features: newFeatures,
                },
            };
        });
    },
}));
