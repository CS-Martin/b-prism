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
import { Avatar, AvatarImage, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@b-prism/shadcn-ui/index';
import { useChangeUserRole } from '@b-prism/web-app/admin-dashboard-hooks';
import { useProgress } from '@bprogress/next';
import { UserDto } from '@dto';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { useRoleStore } from 'apps/web-app/src/stores/role-stores/role.store';
import { UserPlusIcon, X } from 'lucide-react';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { PacmanLoader } from 'react-spinners';

interface ChangeRoleDialogProps {
    session: Session | null;
    isOpen: boolean;
    onClose: () => void;
    user: UserDto | null;
}

export const ChangeRoleDialog = ({ session, isOpen, onClose, user }: ChangeRoleDialogProps) => {
    const { start: loadStart, stop: stopLoad } = useProgress();
    const { isLoading: isChangingRole, error, changeUserRole } = useChangeUserRole();
    const { roles, displayRoles } = useRoleStore();

    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    if (isChangingRole) {
        loadStart();
    } else {
        stopLoad();
    }

    useEffect(() => {
        if (!roles || roles.length === 0) {
            displayRoles(session?.user.access_token || '');
        }
    }, []);

    if (!session || !user) return null;

    const handleRoleChange = async (user: UserDto, newRole: string) => {
        if (user) {
            await changeUserRole(user, newRole, session.user.given_name + ' ' + session.user.family_name, session?.user.access_token || '');
        }

        onClose();
    };

    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className='flex flex-col items-center md:items-start '>
                        <div className='flex items-center justify-center w-10 h-10 mb-3 bg-blue-100 rounded-lg'>
                            <UserPlusIcon
                                height={24}
                                width={24}
                                className='text-blue-600'
                            />
                        </div>
                        {`Assign a new role`}
                    </AlertDialogTitle>
                    <AlertDialogDescription className='text-center'>
                        <div className='flex flex-col items-center gap-1 mb-2 md:gap-3 md:flex-row'>
                            Select a new role for
                            <span className='flex flex-row items-center gap-1 p-1 px-2 bg-gray-100 rounded-full '>
                                <Avatar className='w-5 h-5'>
                                    <AvatarImage src='https://github.com/shadcn.png' />
                                    <AvatarFallback>{`${user.given_name.charAt(0)}${user.family_name.charAt(0)}`}</AvatarFallback>
                                </Avatar>
                                <Label className='text-[13px] text-black'>{`${user.given_name} ${user.family_name}`}</Label>
                                <X
                                    width={14}
                                    height={14}
                                    onClick={onClose}
                                    className='text-black cursor-pointer hover:text-red-500'
                                />
                            </span>
                        </div>
                        <div className='flex flex-col items-center w-full'>
                            <Select onValueChange={(value) => setSelectedRole(value)}>
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder={`Select a role for ${user?.given_name || 'User'}`} />
                                </SelectTrigger>
                                <SelectContent
                                    className='!absolute left-0'
                                    style={{ width: 'inherit' }}>
                                    {roles.map((role, index) => (
                                        <SelectItem
                                            key={index}
                                            value={role.name}
                                            className='cursor-pointer text-wrap'>
                                            {role.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex flex-col-reverse w-full md:flex-row'>
                    <AlertDialogCancel
                        className='mt-0 md:w-1/2'
                        disabled={isChangingRole}
                        onClick={onClose}>
                        No, keep it.
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className='md:w-1/2'
                        disabled={isChangingRole || selectedRole === null}
                        onClick={() => handleRoleChange(user, selectedRole ?? '')}>
                        {isChangingRole ? (
                            <>
                                <PacmanLoader
                                    className={`${isChangingRole ? 'pacman-loader-slide-in' : 'pacman-loader-slide-out'}`}
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
