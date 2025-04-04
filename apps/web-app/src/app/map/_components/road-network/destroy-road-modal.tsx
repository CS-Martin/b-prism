import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Button,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Textarea,
} from '@b-prism/shadcn-ui/index';
import { useProgress } from '@bprogress/next';
import { useRoadNetworkStore } from 'apps/web-app/src/stores/map-stores/road-network.store';
import { GeoJSONFeature } from 'mapbox-gl';
import { Session } from 'next-auth';
import React from 'react';
import { useForm } from 'react-hook-form';

interface DestroyRoadModalProps {
    road: GeoJSONFeature | null;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    session: Session | null;
}

export const DestroyRoadModal = ({ road, setIsDialogOpen, session }: DestroyRoadModalProps) => {
    const { start: startLoading, stop: stopLoading } = useProgress();
    const { isLoading, destroyRoad } = useRoadNetworkStore();

    const { register, handleSubmit, setValue, watch } = useForm({
        defaultValues: {
            roadSeverity: road?.properties?.severity ?? 0,
            description: '',
        },
    });

    if (!session) return;

    const user = session?.user;
    const requestAuthor = `${user?.given_name} ${user?.family_name}`;

    const onSubmit = async (data: { roadSeverity: number; description: string }) => {
        console.log('SUBMITTED');
        if (road && road.properties?.id && user?.permissions.includes('ROAD_NETWORK_PERMISSION')) {
            startLoading();

            await destroyRoad(road.properties.id, data.roadSeverity, data.description, requestAuthor, user.access_token);
            setIsDialogOpen(false);

            stopLoading();
        }
    };

    const handleCancel = () => {
        road = null;
        setIsDialogOpen(false);
    };

    return (
        <AlertDialog
            open={true}
            onOpenChange={setIsDialogOpen}>
            <AlertDialogContent className='max-w-2xl'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Road Damage</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to mark this road as <b>damaged</b>. This action will update the road&apos;s status to indicate that it is <b>no longer passable</b>. Are you
                        sure you want to proceed?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {road && (
                        <div className='flex flex-col gap-y-2'>
                            <Label> Damage Severity</Label>
                            <Select
                                {...register('roadSeverity', { valueAsNumber: true })}
                                onValueChange={(value) => setValue('roadSeverity', Number(value))}
                                value={watch('roadSeverity').toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder='Select severity' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value='0'
                                        disabled>
                                        Not Damaged
                                    </SelectItem>
                                    <SelectItem
                                        value='1'
                                        className='cursor-pointer text-yellow-500 *:hover:text-yellow-500'>
                                        Slightly Damaged - passable but proceed with caution
                                    </SelectItem>
                                    <SelectItem
                                        value='2'
                                        className='text-orange-500 cursor-pointer *:hover:text-orange-500  '>
                                        Moderately Damaged - passable but longer travel time
                                    </SelectItem>
                                    <SelectItem
                                        value='3'
                                        className='text-red-500 *:hover:text-red-500 cursor-pointer'>
                                        Severely Damaged - not passable
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className='flex flex-col gap-y-2'>
                        <Label>Damage Description</Label>
                        <Textarea
                            {...(register('description'), { required: true })}
                            placeholder='This area is severely flooded.'
                        />
                    </div>

                    <AlertDialogFooter className='flex flex-row mt-4'>
                        <AlertDialogCancel
                            className='w-1/2'
                            onClick={handleCancel}>
                            No, Keep it
                        </AlertDialogCancel>
                        <Button
                            className='w-1/2 text-white bg-red-500 hover:bg-red-600'
                            type='submit'>
                            Yes, damage it!
                        </Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    );
};
