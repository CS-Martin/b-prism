import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
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

    console.log(road);
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
            <AlertDialogContent className='max-w-xl'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Road Repair</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to mark this road as passable. This action will update the road&apos;s status to indicate that it is no longer damaged. Are you sure you want
                        to proceed?
                    </AlertDialogDescription>
                </AlertDialogHeader>
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
