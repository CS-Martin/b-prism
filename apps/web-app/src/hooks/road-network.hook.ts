import { useState } from 'react';
import { roadNetworkService } from '../services/road-network.service';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';

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
