import React, { useEffect, useState } from 'react';
import { roadNetworkService } from '../services/road-network.service';
import { ResponseDto, RoadNetworkDto } from '@dto';
import { MapRef } from 'react-map-gl';

export const useDisplayRoadNetworkByBounds = (mapRef: React.RefObject<MapRef>) => {
    const [roadNetwork, setRoadNetwork] = useState<RoadNetworkDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchRoadByBounds = async () => {
        if (!mapRef.current) return; // Ensure map is initialized

        setIsLoading(true);

        try {
            // Get the current visible bounds from the Mapbox map
            const bounds = mapRef.current.getBounds();

            if (!bounds) return;

            const minLng = bounds?.getWest();
            const minLat = bounds?.getSouth();
            const maxLng = bounds?.getEast();
            const maxLat = bounds?.getNorth();

            const response: ResponseDto<RoadNetworkDto[]> = await roadNetworkService.findByBounds(minLng, minLat, maxLng, maxLat);

            if (response.statusCode !== 200) {
                throw new Error('Failed to fetch road network');
            }

            setRoadNetwork(response.body);
        } catch (error) {
            console.error('Error fetching road network:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoadByBounds();
    }, [mapRef]); // Fetch when map reference updates

    return { roadNetwork, fetchRoadByBounds, isLoading };
};

export const useDestroyRoad = () => {
    const [isLoading, setIsLoading] = useState(false);

    const destroyRoad = async (roadId: string, author: string) => {
        setIsLoading(true);

        try {
            const response = await roadNetworkService.destroyRoad(roadId, author);

            setIsLoading(false);

            return response;
        } catch (error) {
            setIsLoading(false);

            throw error;
        }
    };

    return { destroyRoad, isLoading };
};

export const useFixRoad = () => {
    const [isLoading, setIsLoading] = useState(false);

    const fixRoad = async (roadId: string, author: string) => {
        setIsLoading(true);

        try {
            const response = await roadNetworkService.destroyRoad(roadId, author);

            setIsLoading(false);

            return response;
        } catch (error) {
            setIsLoading(false);

            throw error;
        }
    };

    return { fixRoad, isLoading };
};
