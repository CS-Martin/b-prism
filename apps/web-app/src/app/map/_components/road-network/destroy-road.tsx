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
import { UserDto } from '@dto';
import { useDestroyRoad } from 'apps/web-app/src/hooks/road-network.hook';
import { useSession } from 'next-auth/react';
import React from 'react';

interface DestroyRoadProps {
    roadId: string | undefined;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fetchRoadByBounds: () => void;
}

export const DestroyRoad = ({ roadId, setIsDialogOpen, fetchRoadByBounds }: DestroyRoadProps) => {
    const { data: session } = useSession();
    const { destroyRoad } = useDestroyRoad();

    const user: UserDto = session?.user as UserDto;
    const requestAuthor = `${user.given_name} ${user.family_name}`;

    const handleRoadDestroy = async () => {
        if (roadId) {
            await destroyRoad(roadId, requestAuthor);
            setIsDialogOpen(false);

            fetchRoadByBounds();
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
                        className='bg-red-500 hover:bg-red-600 text-white'
                        onClick={handleRoadDestroy}>
                        Yes, Delete it!
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
