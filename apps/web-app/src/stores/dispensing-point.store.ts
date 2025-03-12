import { create } from 'zustand';
import { dispensingPointService } from '../services/dispensing-point.service';
import { DispensingPointDto, ResponseDto } from '@dto';
import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';

// Define Zustand state and actions
interface DispensingPointsState {
    dispensingPointsGeoJson: { type: string; features: any[] };
    isLoading: boolean;
    fetchAllDispensingPoints: () => Promise<void>;
}

// Zustand store definition
export const useDispensingPointsStore = create<DispensingPointsState>((set) => ({
    dispensingPointsGeoJson: { type: 'FeatureCollection', features: [] },
    isLoading: false,

    fetchAllDispensingPoints: async () => {
        set({ isLoading: true });

        try {
            const response: ResponseDto<DispensingPointDto[]> = await dispensingPointService.fetchAllDispensingPoints();

            if (response.statusCode !== 200) {
                throw new Error('Failed to fetch dispensing points');
            }

            const dispensingPoints = response.body;

            // Convert to GeoJSON format
            const dispensingPointsGeoJson = {
                type: 'FeatureCollection',
                features: dispensingPoints.map((dp) => ({
                    type: 'Feature',
                    properties: {
                        id: dp.id,
                        type: 'dispensing_point',
                        name: dp.name,
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [dp.longitude, dp.latitude],
                    },
                })),
            };

            set({ dispensingPointsGeoJson });
        } catch (error: any) {
            console.error('Error fetching dispensing points:', error);

            toast({
                title: 'Error!',
                description: error.message || 'Failed to fetch dispensing points. Please try again.',
                variant: 'destructive',
            });
        } finally {
            set({ isLoading: false });
        }
    },
}));
