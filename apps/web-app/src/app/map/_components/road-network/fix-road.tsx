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
import { RoadNetworkDto, UserDto } from '@dto';
import { useFixRoad } from 'apps/web-app/src/hooks/road-network.hook';
import { useSession } from 'next-auth/react';
import React from 'react';

interface FixRoadProps {
    roadId: string | undefined;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fetchFixRoadByBounds: (forceFetched: boolean) => void;

    UpdateFixedRoad: (roadId: string) => void;
}

export const FixRoad = ({ roadId, setIsDialogOpen, fetchFixRoadByBounds, UpdateFixedRoad }: FixRoadProps) => {
    const { data: session } = useSession();
    const { fixRoad } = useFixRoad();

    const user = session?.user;
    const requestAuthor = `${user?.given_name} ${user?.family_name}`;

    const handleRoadDestroy = async () => {
        if (roadId) {
            await fixRoad(roadId, requestAuthor);
            setIsDialogOpen(false);

            // Doesn't work because if same in previous bound, it will not fetch
            // Need to think of a new method to update UI
            UpdateFixedRoad(roadId);
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
