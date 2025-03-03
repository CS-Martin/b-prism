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
import { useDestroyRoad } from 'apps/web-app/src/hooks/road-network.hook';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

interface DestroyRoadModalProps {
    selectedRoadId: string | null;
    fetchDamagedRoads: () => void;
}

export const DestroyRoadModal = ({ selectedRoadId, fetchDamagedRoads }: DestroyRoadModalProps) => {
    const { data: session } = useSession();
    const { destroyRoad } = useDestroyRoad();

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const user = session?.user;
    const requestAuthor = `${user?.given_name ?? ''} ${user?.family_name ?? ''}`.trim() || 'Unknown User';

    useEffect(() => {
        if (selectedRoadId) {
            setIsDialogOpen(true);
        }
    }, [selectedRoadId]);

    const handleRoadDestroy = async () => {
        if (selectedRoadId) {
            await destroyRoad(selectedRoadId, requestAuthor);
            fetchDamagedRoads();
            setIsDialogOpen(false); // Close modal after action
        }
    };

    const handleCancel = () => {
        setIsDialogOpen(false); // Close modal on cancel
    };

    return (
        <AlertDialog
            open={isDialogOpen}
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
                        className='bg-red-500 hover:bg-red-600 text-white'
                        onClick={handleRoadDestroy}>
                        Yes, damage it!
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
