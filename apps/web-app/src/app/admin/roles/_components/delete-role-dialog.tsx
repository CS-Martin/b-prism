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
import { useRoleStore } from 'apps/web-app/src/stores/role-stores/role.store';
import { AlertTriangle } from 'lucide-react';
import { Session } from 'next-auth';
import React from 'react';

interface DeleteRoleDialogProps {
    session: Session;
    isOpen: boolean;
    onClose: () => void;
    role: RoleDto | null;
}

export const DeleteRoleDialog = ({ session, isOpen, onClose, role }: DeleteRoleDialogProps) => {
    const { isLoading, deleteRole } = useRoleStore();

    const handleDelete = async () => {
        if (role) {
            await deleteRole(role, session.user.given_name + ' ' + session.user.family_name, session.user.access_token);
        }
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
                        This action cannot be undone. All details associated with <b className='text-white'>{role?.name}</b> role will be deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel
                        disabled={isLoading}
                        onClick={onClose}>
                        No, keep it.
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={isLoading}
                        onClick={handleDelete}>
                        I understand, delete this role
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
