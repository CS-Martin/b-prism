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
import { useDestroyRoad, useDisplayRoadNetworkByBounds } from 'apps/web-app/src/hooks/road-network.hook';
import { useSession } from 'next-auth/react';
import React, { RefObject, useRef } from 'react';
import { MapRef } from 'react-map-gl';

interface DestroyRoadProps {
    roadId: string | undefined;
    setIsDestroyDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    mapRef: RefObject<MapRef>;
}

export const DestroyRoad = ({ roadId, setIsDestroyDialogOpen, mapRef }: DestroyRoadProps) => {
    const { data: session } = useSession();
    const { destroyRoad } = useDestroyRoad();
    const { fetchRoadByBounds } = useDisplayRoadNetworkByBounds(mapRef);

    const user: UserDto = session?.user as UserDto;
    const requestAuthor = `${user.given_name} ${user.family_name}`;

    const handleRoadDestroy = async () => {
        if (roadId) {
            await destroyRoad(roadId, requestAuthor);
            setIsDestroyDialogOpen(false);
        }

        if (fetchRoadByBounds) {
            fetchRoadByBounds();
        }
    };

    const handleCancel = () => {
        setIsDestroyDialogOpen(false);
    };

    return (
        <AlertDialog
            open={true}
            onOpenChange={setIsDestroyDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Road?</AlertDialogTitle>
                    <AlertDialogDescription>You are about to delete road from the transport network. Are you absolutely sure?</AlertDialogDescription>
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
