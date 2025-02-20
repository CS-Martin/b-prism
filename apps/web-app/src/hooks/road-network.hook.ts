import { useEffect, useState } from 'react';
import { roadNetworkService } from '../services/road-network.service';
import { ResponseDto, RoadNetworkDto } from '@dto';

export const useDisplayRoadNetwork = () => {
    const [roadNetwork, setRoadNetwork] = useState<RoadNetworkDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchAllRoadNetwork = async () => {
        setIsLoading(true);

        try {
            const response: ResponseDto<RoadNetworkDto[]> = await roadNetworkService.findAll();

            if (response.statusCode !== 200) {
                throw new Error('Failed to fetch road network');
            }

            setIsLoading(false);

            setRoadNetwork(response.body);
        } catch (error) {
            setIsLoading(false);

            throw error;
        }
    };

    useEffect(() => {
        fetchAllRoadNetwork();
    }, []);

    return { roadNetwork, fetchAllRoadNetwork, isLoading };
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
