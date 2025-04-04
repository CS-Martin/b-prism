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
import React, { useEffect, useState } from 'react';

interface DestroyRoadModalProps {
    road: GeoJSONFeature | null;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    session: Session | null;
}

export const DestroyRoadModal = ({ road, setIsDialogOpen, session }: DestroyRoadModalProps) => {
    const { start: startLoading, stop: stopLoading } = useProgress();
    const { isLoading, destroyRoad } = useRoadNetworkStore();
    const [description, setDescription] = useState<string | null>(null);
    const [roadSeverity, setRoadSeverity] = useState<number | null>(null);

    useEffect(() => {
        if (road?.properties?.severity) {
            setRoadSeverity(road.properties.severity);
        }
    }, [road]);

    if (!session) return;

    const user = session?.user;
    const requestAuthor = `${user?.given_name} ${user?.family_name}`;

    const handleRoadDestroy = async () => {
        if (road && road.properties?.id && user?.permissions.includes('ROAD_NETWORK_PERMISSION')) {
            startLoading();

            console.log(road.properties.id, roadSeverity, description, requestAuthor);
            await destroyRoad(road.properties.id, roadSeverity, description, requestAuthor);
            setIsDialogOpen(false);

            stopLoading();
        }
    };

    const handleCancel = () => {
        road = null;
        setDescription(null);
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

                {road && (
                    <div className='flex flex-col gap-y-2'>
                        <Label> Damage Severity</Label>
                        <Select
                            value={roadSeverity?.toString() ?? '0'}
                            onValueChange={(value) => setRoadSeverity(Number(value))}>
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
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder='This area is severely flooded.'
                    />
                </div>
                <AlertDialogFooter className='flex flex-row'>
                    <AlertDialogCancel
                        className='w-1/2'
                        onClick={handleCancel}>
                        No, Keep it
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='w-1/2 text-white bg-red-500 hover:bg-red-600'
                        onClick={handleRoadDestroy}>
                        Yes, damage it!
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
