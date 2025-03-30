import { useEffect, useState } from 'react';
import { CreateDispensingPointDto, DispensingPointDto, ResponseDto, UpdateDispensingPointDto } from '@dto';
import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { dispensingPointService } from '../services/dispensing-point.service';
import { useProgress } from '@bprogress/next';

/**
 * @description Hooks for dispensing points
 */

export const useDisplayDispensingPoints = () => {
    const { start, stop } = useProgress();
    const [dispensingPoints, setDispensingPoints] = useState<DispensingPointDto[]>([]);

    const fetchAllDispensingPoints = async () => {
        try {
            start();

            const response: ResponseDto<DispensingPointDto[]> = await dispensingPointService.fetchAllDispensingPoints();

            if (response.statusCode !== 200) {
                throw new Error('Failed to fetch dispensing points');
            }

            setDispensingPoints(response.body);
        } catch (error: any) {
            console.error('Error creating warehouse:', error);

            const errorMessage = error.message || 'Failed to create dispensing point. Please try again.';

            toast({
                title: 'Error!',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            stop();
        }
    };

    useEffect(() => {
        if (dispensingPoints.length === 0) {
            fetchAllDispensingPoints();
        }
    }, []);

    return { dispensingPoints, fetchAllDispensingPoints };
};

export const useFindOneDispensingPoint = (id: string) => {
    const { start, stop } = useProgress();
    const [dispensingPoint, setDispensingPoint] = useState<DispensingPointDto>({} as DispensingPointDto);

    const fetchOneDispensingPoint = async () => {
        try {
            start();
            const response: ResponseDto<DispensingPointDto> = await dispensingPointService.findOne(id);

            if (response.statusCode !== 200) {
                throw new Error('Failed to fetch dispensing point');
            }

            setDispensingPoint(response.body);
        } catch (error: any) {
            console.error('Error creating warehouse:', error);

            const errorMessage = error.message || 'Failed to create dispensing point. Please try again.';

            toast({
                title: 'Error!',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            stop();
        }
    };

    useEffect(() => {
        fetchOneDispensingPoint();
    }, [id]);

    return { dispensingPoint, fetchOneDispensingPoint };
};

export const useCreateDispensingPoint = () => {
    const { start, stop } = useProgress();

    const createDispensingPoint = async (data: CreateDispensingPointDto, author: string, access_token: string): Promise<DispensingPointDto | undefined> => {
        try {
            start();

            const newDispensingPoint: DispensingPointDto = await dispensingPointService.create(
                {
                    ...data,
                    capacity: Number(data.capacity),
                },
                author,
                access_token,
            );

            toast({
                title: 'Success!',
                description: `The dispensing point ${data.name} has been created successfully`,
                variant: 'success',
            });

            return newDispensingPoint;
        } catch (error: any) {
            console.error('Error creating warehouse:', error);

            const errorMessage = error.message || 'Failed to create dispensing point. Please try again.';

            toast({
                title: 'Error!',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            stop();
        }
    };

    return { createDispensingPoint };
};

export const useUpdateDispensingPoint = () => {
    const { start, stop } = useProgress();

    const updateDispensingPoint = async (id: string, data: UpdateDispensingPointDto, author: string, access_token: string) => {
        try {
            start();
            await dispensingPointService.update(id, data, author, access_token);

            toast({
                title: 'Success!',
                description: `The dispensing point ${data.name} has been updated successfully`,
                variant: 'success',
            });
        } catch (error: any) {
            console.error('Error creating warehouse:', error);

            const errorMessage = error.message || 'Failed to update dispensing point. Please try again.';

            toast({
                title: 'Error!',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            stop();
        }
    };

    return { updateDispensingPoint };
};

export const useDeleteDispensingPoint = () => {
    const { start, stop } = useProgress();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const deleteDispensingPoint = async (id: string, author: string, access_token: string) => {
        try {
            start();
            setIsLoading(true);
            await dispensingPointService.delete(id, author, access_token);

            toast({
                title: 'Dispensing point deleted successfully!',
                variant: 'success',
            });
        } catch (error: any) {
            console.error('Error creating warehouse:', error);

            const errorMessage = error.message || 'Failed to delete dispensing point. Please try again.';

            toast({
                title: 'Error!',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            stop();
            setIsLoading(false);
        }
    };

    return { isLoading, deleteDispensingPoint };
};
