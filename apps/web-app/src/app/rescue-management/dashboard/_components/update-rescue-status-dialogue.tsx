import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@b-prism/shadcn-ui/index';
import { RescuePostDto } from '@dto';
import { useRescuePostStore } from 'apps/web-app/src/stores/rescue-post-stores/rescue-post.store';
import { UserPlusIcon } from 'lucide-react';
import { Session } from 'next-auth';
import { PacmanLoader } from 'react-spinners';

interface UpdateRescueStatusDialogueProps {
    rescuePost: RescuePostDto | null;
    isDialogOpen: boolean;
    status: 'unattended' | 'pending' | 'rescued' | null;
    session: Session | null;
    onClose: () => void;
}

export const UpdateRescueStatusDialogue = ({ rescuePost, isDialogOpen, onClose, status, session }: UpdateRescueStatusDialogueProps) => {
    // --- Handlers ---
    const { isLoading, error, updateRescePostStatus } = useRescuePostStore();

    const handleRescueStatusUpdate = async (rescuePost: RescuePostDto | null) => {
        if (rescuePost && session) {
            const author: string = session.user.given_name + ' ' + session.user.family_name;
            const token: string = session.user.access_token;

            await updateRescePostStatus(rescuePost.id, status, author, token);
        }

        onClose();
    };

    // if (error) {
    //     toast({
    //         title: 'Error',
    //         description: error,
    //         variant: 'destructive',
    //     });

    //     return;
    // }

    return (
        <AlertDialog open={isDialogOpen}>
            <AlertDialogContent className='sm:max-w-[425px]'>
                <AlertDialogHeader>
                    <AlertDialogTitle className='flex flex-col items-center md:items-start '>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        {status === 'pending' ? 'You are about to dispatch a rescuer team to rescue' : 'You are about to mark this as rescued'}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex flex-col-reverse w-full md:flex-row'>
                    <AlertDialogCancel
                        className='mt-0 md:w-1/2'
                        onClick={onClose}>
                        No, keep it.
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='md:w-1/2'
                        disabled={isLoading || rescuePost === null}
                        onClick={() => handleRescueStatusUpdate(rescuePost)}>
                        {isLoading ? (
                            <>
                                <PacmanLoader
                                    className={`${isLoading ? 'pacman-loader-slide-in' : 'pacman-loader-slide-out'}`}
                                    color='white'
                                    size={10}
                                />
                            </>
                        ) : (
                            <span>Yes, change it.</span>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
