import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { roadNetworkService } from '../services/road-network.service';
import { RoadNetworkDto } from '@dto';
import { MapRef } from 'react-map-gl';
import { debounce } from 'lodash';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';

export const useDisplayDamagedRoads = () => {
    const [damagedRoads, setDamagedRoads] = useState<RoadNetworkDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchDamagedRoads = async () => {
        console.log('FETCHING DAMAGED ROADS');
        try {
            setIsLoading(true);

            const response = await roadNetworkService.findAllDamagedRoads();

            setDamagedRoads(response.body);
        } catch (error) {
            console.error('Error fetching road network:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDamagedRoads();
    }, []);

    return { damagedRoads, fetchDamagedRoads, isLoading };
};

export const useDisplayFixedRoadNetworkByBounds = (mapRef: React.RefObject<MapRef>) => {
    const [fixedRoadNetwork, setFixedRoadNetwork] = useState<RoadNetworkDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [prevBounds, setPrevBounds] = useState<string | null>(null);

    const fetchFixedRoadsByBounds = useCallback(async () => {
        if (!mapRef.current) {
            return;
        }

        const bounds = mapRef.current.getBounds();

        if (!bounds) {
            return;
        }

        const minLng = bounds.getWest();
        const minLat = bounds.getSouth();
        const maxLng = bounds.getEast();
        const maxLat = bounds.getNorth();

        const boundsKey = `${minLng},${minLat},${maxLng},${maxLat}`;

        if (boundsKey === prevBounds) return; // Prevent unnecessary re-fetch

        setPrevBounds(boundsKey);
        setIsLoading(true);

        try {
            const response = await roadNetworkService.findFixRoadByBounds(minLng, minLat, maxLng, maxLat);
            if (response.statusCode !== 200) {
                throw new Error('Failed to fetch road network');
            }

            const newRoads = response.body;

            // Merge new roads with existing ones without duplicates
            setFixedRoadNetwork((prevNetwork) => {
                const existingRoadIds = new Set(prevNetwork.map((road) => road.id));
                const updatedNetwork = [...prevNetwork, ...newRoads.filter((road) => !existingRoadIds.has(road.id))];
                return updatedNetwork;
            });
        } catch (error) {
            console.error('Error fetching road network:', error);
        } finally {
            setIsLoading(false);
        }
    }, [mapRef, prevBounds]);

    // Debounce the fetch function
    const debouncedFetchFixedRoadsByBounds = useMemo(() => debounce(fetchFixedRoadsByBounds, 500), [fetchFixedRoadsByBounds]);

    useEffect(() => {
        if (!mapRef.current) {
            return;
        }

        const map = mapRef.current;

        fetchFixedRoadsByBounds(); // Initial fetch

        const handleMoveEnd = () => {
            debouncedFetchFixedRoadsByBounds();
        };

        map?.on('moveend', handleMoveEnd);

        return () => {
            map?.off('moveend', handleMoveEnd);
            debouncedFetchFixedRoadsByBounds.cancel();
        };
    }, [debouncedFetchFixedRoadsByBounds, mapRef, fetchFixedRoadsByBounds]);

    return { fixedRoadNetwork, fetchFixedRoadsByBounds, isLoading };
};

export const useDestroyRoad = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const destroyRoad = async (roadId: string, author: string) => {
        setIsLoading(true);

        try {
            const response = await roadNetworkService.destroyRoad(roadId, author);

            setIsLoading(false);

            toast({
                title: 'Road Deleted',
                description: `The road has been successfully deleted.`,
                variant: 'success',
            });

            return response;
        } catch (error) {
            setIsLoading(false);

            toast({
                title: 'Error Deleting Road',
                description: `${error}`,
                variant: 'destructive',
            });

            throw error;
        }
    };

    return { destroyRoad, isLoading };
};

export const useFixRoad = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const fixRoad = async (roadId: string, author: string) => {
        setIsLoading(true);

        try {
            const response = await roadNetworkService.fixRoad(roadId, author);

            setIsLoading(false);

            toast({
                title: 'Road Fixed',
                description: `The road has been successfully fixed.`,
                variant: 'success',
            });

            return response;
        } catch (error) {
            setIsLoading(false);

            toast({
                title: 'Error Fixing Road',
                description: `${error}`,
                variant: 'destructive',
            });

            throw error;
        }
    };

    return { fixRoad, isLoading };
};
