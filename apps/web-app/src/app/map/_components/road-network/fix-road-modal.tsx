import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
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

interface FixRoadModalProps {
    road: GeoJSONFeature | null;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    session: Session | null;
}

export const FixRoadModal = ({ road, setIsDialogOpen, session }: FixRoadModalProps) => {
    const { start: startLoading, stop: stopLoading } = useProgress();
    const { fixRoad } = useRoadNetworkStore();

    if (!session) return;

    const user = session?.user;
    const requestAuthor = `${user?.given_name} ${user?.family_name}`;

    const handleRoadFix = async () => {
        if (road && road.properties?.id && user?.permissions.includes('ROAD_NETWORK_PERMISSION')) {
            startLoading();

            await fixRoad(road.properties.id, 0, null, requestAuthor, user.access_token);
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
                    <AlertDialogTitle>Confirm Road Repair</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to mark this road as passable. This action will update the road&apos;s status to indicate that it is no longer damaged. Are you sure you want
                        to proceed?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {road && (
                    <div className='flex flex-col gap-y-2'>
                        <Label> Damage Severity</Label>
                        <Select
                            disabled
                            value={road.properties?.severity.toString() ?? '0'}>
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

                {road?.properties?.description && (
                    <div className='flex flex-col gap-y-2'>
                        <Label>Damage Description</Label>
                        <Textarea
                            disabled
                            readOnly={true}
                            value={road.properties.description}
                            placeholder='This area is severely flooded.'
                        />
                    </div>
                )}
                <AlertDialogFooter className='flex flex-row '>
                    <AlertDialogCancel
                        onClick={handleCancel}
                        className='w-1/2'>
                        No, Keep it
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='w-1/2 text-white bg-green-500 hover:bg-green-600'
                        onClick={handleRoadFix}>
                        Yes, repair it!
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
