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
import { UserPlusIcon } from 'lucide-react';
import { Session } from 'next-auth';

interface UpdateRescueStatusDialogueProps {
    rescuePost: RescuePostDto | null;
    isDialogOpen: boolean;
    status: 'rescued' | 'pending';
    session: Session | null;
    onClose: () => void;
}

export const UpdateRescueStatusDialogue = ({ isDialogOpen, onClose, status, session }: UpdateRescueStatusDialogueProps) => {
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
                    <AlertDialogAction>haha</AlertDialogAction>
                    {/* <AlertDialogAction
                        className='md:w-1/2'
                        disabled={isLoading || selectedRole === null}
                        onClick={() => handleRoleChange(user, selectedRole ?? '')}>
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
                    </AlertDialogAction> */}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
