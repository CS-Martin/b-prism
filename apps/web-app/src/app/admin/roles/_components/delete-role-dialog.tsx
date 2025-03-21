import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@b-prism/shadcn-ui/components/ui/alert-dialog';
import { RoleDto } from '@dto';
import { AlertTriangle, TriangleAlert } from 'lucide-react';

interface DeleteRoleDialogProps {
    isOpen: boolean;
    onClose: () => void;
    role: RoleDto | null;
}

export const DeleteRoleDialog = ({ isOpen, onClose, role }: DeleteRoleDialogProps) => {
    console.log(role);
    const handleDelete = async () => {
        console.log(`Deleting role with ID: ${role?.id}`);

        onClose();
    };
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className='flex flex-col items-center justify-center text-center'>
                        <div className='flex items-center justify-center w-12 h-12 mb-3 bg-red-100 rounded-full'>
                            <AlertTriangle
                                height={30}
                                width={30}
                                className='text-red-600'
                            />
                        </div>
                        {`Are you absolutely sure?`}
                    </AlertDialogTitle>
                    <AlertDialogDescription className='text-center'>
                        This action cannot be undone. All details associated with ${role?.name} will be deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
