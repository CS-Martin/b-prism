import { RoadNetworkDto } from '@dto';
import { create } from 'zustand';
import { roadNetworkService } from '../../services/road-network.service';
import React from 'react';
import { MapRef } from 'react-map-gl';
import { debounce, DebouncedFunc } from 'lodash';
import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';

type RoadNetworkState = {
    damagedRoads: any[];
    fixedRoads: any[];

    prevBounds: string | null;

    fetchDamagedRoads: () => Promise<void>;
    fetchFixedRoadsByBounds: DebouncedFunc<(mapRef: React.RefObject<MapRef>) => Promise<void>>;

    destroyRoad: (roadId: string, severity: number | null, description: string | null, author: string, token: string) => Promise<void>;
    fixRoad: (roadId: string, severity: number | null, description: string | null, author: string, token: string) => Promise<void>;

    isLoading: boolean;
};

export const useRoadNetworkStore = create<RoadNetworkState>((set) => ({
    damagedRoads: [],
    fixedRoads: [],
    prevBounds: null,
    isLoading: false,

    destroyRoad: async (roadId: string, severity: number | null, description: string | null, author: string, token: string) => {
        set({ isLoading: true });

        console.log('Destroying road with ID:', roadId);

        try {
            await roadNetworkService.destroyRoad(roadId, severity, description, author, token);

            toast({
                title: 'Success',
                description: 'Road destroyed successfully',
                variant: 'success',
            });

            await useRoadNetworkStore.getState().fetchDamagedRoads();
        } catch (error) {
            console.error('Error destroying road:', error);

            toast({
                title: 'Error',
                description: 'An error occurred while destroying the road',
                variant: 'destructive',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    fixRoad: async (roadId: string, severity: number | null, description: string | null, author: string, token: string) => {
        set({ isLoading: true });
        try {
            await roadNetworkService.fixRoad(roadId, severity, description, author, token);

            // Trigger refetch to update UI
            await useRoadNetworkStore.getState().fetchDamagedRoads();

            toast({
                title: 'Success',
                description: 'Road fixed successfully',
                variant: 'success',
            });
        } catch (error) {
            console.error('Error fixing road:', error);

            toast({
                title: 'Error',
                description: 'An error occurred while fixing the road',
                variant: 'destructive',
            });
        } finally {
            set({ isLoading: false });
        }
    },

    fetchDamagedRoads: async () => {
        set({ isLoading: true });

        try {
            const damagedRoads: RoadNetworkDto[] = await roadNetworkService.findAllDamagedRoads();

            const damagedRoadsGeoformat =
                damagedRoads?.map((road: RoadNetworkDto, index: number) => ({
                    id: index + Date.now(),
                    type: road.type,
                    is_damaged: road.is_damaged,
                    severity: road.severity,
                    description: road.description,
                    properties: {
                        id: road.id,
                        is_damaged: road.is_damaged,
                        description: road.description,
                        severity: road.severity,
                        ...road.properties,
                    },
                    geometry: road.geometry,
                })) ?? [];

            set({ damagedRoads: damagedRoadsGeoformat });
        } catch (error) {
            console.error('Error fetching damaged roads:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchFixedRoadsByBounds: debounce(async (mapRef: React.RefObject<MapRef>) => {
        if (!mapRef.current) return;

        const prevBounds = useRoadNetworkStore.getState().prevBounds;
        const fixedRoads = useRoadNetworkStore.getState().fixedRoads;

        const bounds = mapRef.current.getBounds();
        if (!bounds) {
            throw Error('Map Error: Bounds not found');
        }

        const minLng = bounds.getWest();
        const minLat = bounds.getSouth();
        const maxLng = bounds.getEast();
        const maxLat = bounds.getNorth();

        const boundsKey = `${minLng},${minLat},${maxLng},${maxLat}`;

        if (boundsKey === prevBounds) return; // Prevent unnecessary re-fetch

        set({ prevBounds: boundsKey, isLoading: true });

        try {
            const fixedRoadsResponse = await roadNetworkService.findFixRoadByBounds(minLng, minLat, maxLng, maxLat);

            const geoJsonFixedRoads =
                fixedRoadsResponse.map((road: RoadNetworkDto, index: number) => ({
                    id: index + Date.now(),
                    type: road.type,
                    is_damaged: road.is_damaged,
                    severity: road.severity,
                    description: road.description,
                    properties: {
                        id: road.id,
                        is_damaged: road.is_damaged,
                        description: road.description,
                        severity: road.severity,
                        ...road.properties,
                    },
                    geometry: road.geometry,
                })) ?? [];

            // Merging new roads with existing ones without duplicates
            const existingRoadIds = new Set(fixedRoads.map((road: any) => road.properties.id));
            const updatedFixedRoads = [...fixedRoads, ...geoJsonFixedRoads.filter((road) => !existingRoadIds.has(road.properties.id))];

            set({ fixedRoads: updatedFixedRoads });
        } catch (error) {
            console.error('Error fetching fixed roads:', error);
        } finally {
            set({ isLoading: false });
        }
    }, 500),
}));
