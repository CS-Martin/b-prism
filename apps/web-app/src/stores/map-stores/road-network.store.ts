import { RoadNetworkDto } from '@dto';
import { create } from 'zustand';
import { roadNetworkService } from '../../services/road-network.service';
import React from 'react';
import { MapRef } from 'react-map-gl';
import { debounce, DebouncedFunc } from 'lodash';
import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { useProgress } from '@bprogress/next';

type RoadNetworkState = {
    damagedRoads: any;
    fixedRoads: any;

    prevBounds: string | null;

    fetchDamagedRoads: () => Promise<void>;
    fetchFixedRoadsByBounds: DebouncedFunc<(mapRef: React.RefObject<MapRef>) => Promise<void>>;

    destroyRoad: (roadId: string, author: string) => Promise<void>;
    fixRoad: (roadId: string, author: string) => Promise<void>;

    isLoading: boolean;
};

export const useRoadNetworkStore = create<RoadNetworkState>((set) => ({
    damagedRoads: [],
    fixedRoads: [],
    prevBounds: null,
    isLoading: false,

    destroyRoad: async (roadId: string, author: string) => {
        set({ isLoading: true });
        try {
            await roadNetworkService.destroyRoad(roadId, author);

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

    fixRoad: async (roadId: string, author: string) => {
        set({ isLoading: true });
        try {
            await roadNetworkService.fixRoad(roadId, author);

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
                    properties: {
                        id: road.id,
                        is_damaged: road.is_damaged,
                        damage_probability: road.damage_probability,
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
                    type: 'Feature',
                    id: index + Date.now(),
                    geometry: road.geometry,
                    properties: {
                        id: road.id,
                        is_damaged: road.is_damaged,
                        damage_probability: road.damage_probability,
                    },
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
