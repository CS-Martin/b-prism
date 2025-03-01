import { useEffect, useState } from 'react';
import { CreateDispensingPointDto, DispensingPointDto, RescuePostDto, ResponseDto, UpdateDispensingPointDto } from '@dto';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { dispensingPointService } from '../services/dispensing-point.service';
import { rescuePostService } from '../services/rescue-post.service';

/**
 * @description Hooks for dispensing points
 */

export const useDisplayDispensingPoints = () => {
    const { toast } = useToast();
    const [dispensingPoints, setDispensingPoints] = useState<DispensingPointDto[]>([]);

    const fetchAllDispensingPoints = async () => {
        try {
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
        }
    };

    useEffect(() => {
        fetchAllDispensingPoints();
    }, []);

    return { dispensingPoints, fetchAllDispensingPoints };
};

export const useFindOneDispensingPoint = (id: string) => {
    const { toast } = useToast();
    const [dispensingPoint, setDispensingPoint] = useState<DispensingPointDto>({} as DispensingPointDto);

    const fetchOneDispensingPoint = async () => {
        try {
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
        }
    };

    useEffect(() => {
        fetchOneDispensingPoint();
    }, [id]);

    return { dispensingPoint, fetchOneDispensingPoint };
};

export const useCreateDispensingPoint = () => {
    const { toast } = useToast();

    const createDispensingPoint = async (data: CreateDispensingPointDto, author: string, accessToken: string) => {
        try {
            await dispensingPointService.create(
                {
                    ...data,
                    capacity: Number(data.capacity),
                },
                author,
                accessToken,
            );

            toast({
                title: 'Success!',
                description: `The dispensing point ${data.name} has been created successfully`,
                variant: 'success',
            });
        } catch (error: any) {
            console.error('Error creating warehouse:', error);

            const errorMessage = error.message || 'Failed to create dispensing point. Please try again.';

            toast({
                title: 'Error!',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    };

    return { createDispensingPoint };
};

export const useUpdateDispensingPoint = () => {
    const { toast } = useToast();

    const updateDispensingPoint = async (id: string, data: UpdateDispensingPointDto, author: string, accessToken: string) => {
        try {
            await dispensingPointService.update(id, data, author, accessToken);

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
        }
    };

    return { updateDispensingPoint };
};

export const useDeleteDispensingPoint = () => {
    const { toast } = useToast();

    const deleteDispensingPoint = async (id: string, author: string, accessToken: string) => {
        try {
            await dispensingPointService.delete(id, author, accessToken);

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
        }
    };

    return { deleteDispensingPoint };
};
