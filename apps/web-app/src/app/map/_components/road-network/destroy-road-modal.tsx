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
import { Session } from 'next-auth';
import React, { useEffect } from 'react';

interface DestroyRoadModalProps {
    roadId: string | undefined;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    session: Session | null;
}

export const DestroyRoadModal = ({ roadId, setIsDialogOpen, session }: DestroyRoadModalProps) => {
    const { start: startLoading, stop: stopLoading } = useProgress();
    const { isLoading, destroyRoad } = useRoadNetworkStore();

    if (!session) return;

    const user = session?.user;
    const requestAuthor = `${user?.given_name} ${user?.family_name}`;

    const handleRoadDestroy = async () => {
        if (roadId && user?.permissions.includes('ROAD_NETWORK_PERMISSION')) {
            startLoading();
            await destroyRoad(roadId, requestAuthor);
            setIsDialogOpen(false);
            stopLoading();
        }
    };

    const handleCancel = () => {
        roadId = '';
        setIsDialogOpen(false);
    };

    return (
        <AlertDialog
            open={true}
            onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Road Damage</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to mark this road as <b>damaged</b>. This action will update the road&apos;s status to indicate that it is <b>no longer passable</b>. Are you
                        sure you want to proceed?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>No, Keep it</AlertDialogCancel>
                    <AlertDialogAction
                        className='text-white bg-red-500 hover:bg-red-600'
                        onClick={handleRoadDestroy}>
                        Yes, damage it!
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
