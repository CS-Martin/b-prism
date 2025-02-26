import React, { useCallback, useEffect, useRef, useState } from 'react';
import { roadNetworkService } from '../services/road-network.service';
import { ResponseDto, RoadNetworkDto } from '@dto';
import { MapRef } from 'react-map-gl';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';

export const useDisplayDamagedRoads = () => {
    const [damagedRoads, setDamagedRoads] = useState<RoadNetworkDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchDamagedRoads = async () => {
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

    console.log('1');

    const fetchFixedRoadsByBounds = useCallback(async () => {
        if (!mapRef.current) {
            console.log("MapRef is null, can't fetch bounds.");
            return;
        }

        const bounds = mapRef.current.getBounds();
        if (!bounds) {
            console.log('Bounds are null, skipping fetch.');
            return;
        }

        const minLng = bounds.getWest();
        const minLat = bounds.getSouth();
        const maxLng = bounds.getEast();
        const maxLat = bounds.getNorth();

        const boundsKey = `${minLng},${minLat},${maxLng},${maxLat}`;

        if (boundsKey === prevBounds) return; // Prevent unnecessary re-fetch

        setPrevBounds(boundsKey); // Move inside to prevent stale values
        setIsLoading(true);

        try {
            const response = await roadNetworkService.findFixRoadByBounds(minLng, minLat, maxLng, maxLat);
            if (response.statusCode !== 200) {
                throw new Error('Failed to fetch road network');
            }
            setFixedRoadNetwork(response.body);
        } catch (error) {
            console.error('Error fetching road network:', error);
        } finally {
            setIsLoading(false);
        }
    }, [mapRef, prevBounds]);

    // Attach Event Listener When Map is Ready**
    useEffect(() => {
        if (!mapRef.current) {
            console.log('Waiting for map to load...');
            return;
        }

        const map = mapRef.current;
        console.log('Map is loaded! Attaching moveend event listener.');

        fetchFixedRoadsByBounds(); // Initial fetch

        const handleMoveEnd = () => {
            console.log('Map moved! Fetching new bounds...');
            fetchFixedRoadsByBounds();
        };

        map?.on('moveend', handleMoveEnd);

        return () => {
            console.log('Cleaning up moveend event listener.');
            map?.off('moveend', handleMoveEnd);
        };
    }, [fetchFixedRoadsByBounds]);

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
