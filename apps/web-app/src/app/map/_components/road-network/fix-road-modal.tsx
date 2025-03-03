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
import { useFixRoad } from 'apps/web-app/src/hooks/road-network.hook';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

interface FixRoadModalProps {
    roadId: string | null;
}

export const FixRoadModal = ({ roadId }: FixRoadModalProps) => {
    const { data: session } = useSession();
    const { fixRoad } = useFixRoad();

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const user = session?.user;
    const requestAuthor = `${user?.given_name} ${user?.family_name}`;

    const handleRoadDestroy = async () => {
        if (roadId) {
            await fixRoad(roadId, requestAuthor);
            setIsDialogOpen(false);
        }
    };

    const handleCancel = () => {
        roadId = null;
        setIsDialogOpen(false);
    };

    return (
        <AlertDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Road Repair</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are about to mark this road as passable. This action will update the road&apos;s status to indicate that it is no longer damaged. Are you sure you want
                        to proceed?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>No, Keep it</AlertDialogCancel>
                    <AlertDialogAction
                        className='bg-green-500 hover:bg-green-600 text-white'
                        onClick={handleRoadDestroy}>
                        Yes, repair it!
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
