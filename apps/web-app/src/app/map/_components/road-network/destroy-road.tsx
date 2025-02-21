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

interface DestroyRoadProps {
    roadId: string;
}

export const DestroyRoad = ({ roadId }: DestroyRoadProps) => {
    const { data: session } = useSession();

    const user: UserDto = session?.user as UserDto;
    const requestAuthor = `${user.given_name} ${user.family_name}`;

    const { destroyRoad } = useDestroyRoad();

    const handleRoadDestroy = async () => {
        await destroyRoad(roadId, requestAuthor);
    };

    return (
        <AlertDialog>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Road?</AlertDialogTitle>
                    <AlertDialogDescription>You are about to delete road from the transport network. Are you absolutely sure?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>No, Keep it</AlertDialogCancel>
                    <AlertDialogAction onClick={handleRoadDestroy}>Yes, Delete it!</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
