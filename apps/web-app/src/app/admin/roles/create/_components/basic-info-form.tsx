import { Avatar, AvatarFallback, AvatarImage, Input, Label, Separator, Textarea } from '@b-prism/shadcn-ui/index';
import { useRoleStore } from 'apps/web-app/src/stores/role-stores/role.store';
import { CalendarDays, UserRound } from 'lucide-react';
import { Session } from 'next-auth';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface RoleBasicInfoFormProps {
    register: UseFormRegister<{ name: string; description: string; adminPermissions: any; mapPermissions: any }>;
    errors: FieldErrors<{ name: string; description: string; adminPermissions: any; mapPermissions: any }>;
    readOnly?: boolean;
    session: Session;
}

export const RoleBasicInfoForm = ({ register, errors, readOnly, session }: RoleBasicInfoFormProps) => {
    const { roles } = useRoleStore();
    console.log(roles);
    return (
        <div className='mt-5'>
            <div className=''>
                <div>
                    <Label>Role Name</Label>
                    <Input
                        id='role_name'
                        type='text'
                        className='mt-1'
                        {...register('name', {
                            required: 'Role Name is required.',
                            validate: (value) => (roles.some((role) => role.name.toLowerCase() === value.toLowerCase()) ? 'Role name already exists' : true),
                        })}
                        readOnly={readOnly}
                    />
                    {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>}
                </div>

                <div className='mt-4'>
                    <Label>Description</Label>
                    <Textarea
                        id='role_description'
                        className='mt-1'
                        {...register('description', { required: 'Description is required.' })}
                        readOnly={readOnly}
                    />
                    {errors.description && <p className='mt-1 text-sm text-red-500'>{errors.description.message}</p>}
                </div>

                {readOnly && (
                    <div className='py-5'>
                        <Separator
                            orientation='horizontal'
                            className='w-full'
                        />
                        <div className='flex flex-row items-center py-5'>
                            <div className='flex flex-col w-1/2 gap-3 mb-auto'>
                                <Label className='flex flex-row items-center gap-1'>
                                    <UserRound
                                        height={16}
                                        width={16}
                                    />{' '}
                                    Author:
                                </Label>
                                <span className='flex flex-row items-center'>
                                    <Avatar
                                        className='w-7 h-7'
                                        style={{ borderRadius: '500px' }}>
                                        <AvatarImage src='https://github.com/shadcn.png' />
                                        <AvatarFallback>{session ? `${session.user?.given_name?.[0]}${session.user?.family_name?.[0]}` : 'GE'}</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col ml-2'>
                                        <span className=''>{`${session?.user?.given_name || 'Guest'} ${session?.user?.family_name || 'User'}`}</span>
                                        <Label className='text-xs'>{session?.user.role || 'Guest'}</Label>
                                    </div>
                                </span>
                            </div>
                            <div className='flex flex-col items-start w-1/2 gap-3 mb-auto'>
                                <Label className='flex flex-row items-center gap-2'>
                                    <CalendarDays
                                        height={16}
                                        width={16}
                                    />
                                    Date:
                                </Label>
                                <span>
                                    {new Date().toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: 'numeric',
                                        hour12: true,
                                    })}
                                </span>
                            </div>
                        </div>
                        <Separator
                            orientation='horizontal'
                            className='w-full'
                        />
                    </div>
                )}

                <div className='mt-4'>
                    <Label>Apply roles to:</Label>
                    <Textarea
                        id='additional_info'
                        name='additional_info'
                    />
                </div>
            </div>
        </div>
    );
};
