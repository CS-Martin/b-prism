import { Avatar, AvatarFallback, AvatarImage, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Label } from '@b-prism/shadcn-ui/index';
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { RoleDto } from '@dto';

export const CreateRoleDatatableColumns = (handleDeleteClick: (role: RoleDto) => void) => {
    return [
        {
            accessorKey: 'name',
            header: 'Role Name',
            cell: ({ row }: { row: any }) => {
                const name = row.getValue('name');
                const description = row.original?.description || ''; // Safely access description

                return (
                    <div className='flex min-w-[200px] max-w-[350px] flex-col gap-1 whitespace-normal'>
                        <span className='font-semibold'>{name}</span>
                        {description && <Label className='text-sm break-words'>{description}</Label>}
                    </div>
                );
            },
        },
        {
            accessorKey: 'permissions',
            header: () => <div className='text-start'>Permissions</div>,
            size: 5,
            cell: ({ row }: { row: any }) => {
                const permissionLabels: Record<string, string> = {
                    ACTIVITY_LOG_PERMISSION: 'Activity Log Actions',
                    WAREHOUSE_PERMISSION: 'Warehouse Actions',
                    DISPENSING_POINT_PERMISSION: 'Dispensing Point Actions',
                    ROAD_NETWORK_PERMISSION: 'Road Network Actions',
                    ACCOUNT_CREATION: 'Account Creation',
                    RESCUE_POST_PERMISSION: 'Rescue Post Actions',
                    ROLE_PERMISSION: 'Role Management',
                    NOTIFICATION_PERMISSION: 'Notifications',
                };

                return (
                    <div className='flex flex-wrap items-center w-[300px] md:min-w-[350px] md:max-w-[600px] justify-start gap-2 text-center whitespace-normal'>
                        {row.getValue('permissions').map((permission: string, index: number) => (
                            <span
                                key={index}
                                className='px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full cursor-pointer'>
                                {permissionLabels[permission]}
                            </span>
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: 'created_by',
            header: 'Created by',
            cell: ({ row }: { row: any }) => {
                const created_by = row.getValue('created_by');

                return (
                    <div>
                        <span className='flex flex-row items-center whitespace-normal min-w-[150px]'>
                            <Avatar
                                className='w-8 h-8'
                                style={{ borderRadius: '500px' }}>
                                <AvatarImage src='https://github.com/shadcn.png' />
                                <AvatarFallback>{'GE'}</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col ml-2'>
                                <span className='font-semibold'>{`${created_by}`}</span>
                                <Label className='text-xs'>{'Developer'}</Label>
                            </div>
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: 'created_at',
            header: 'Created Date',
            cell: ({ row }: { row: any }) => {
                const date = new Date(row.getValue('created_at') as string);
                return (
                    <Label className=' whitespace-normal min-w-[300px] '>
                        {date.toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        })}
                    </Label>
                );
            },
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }: { row: any }) => {
                const role = row.original;

                return (
                    <div className='flex justify-center'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant={'ghost'}
                                    className='p-2 rounded-full hover:bg-gray-100'>
                                    <EllipsisVertical
                                        height={20}
                                        width={20}
                                        className='text-gray-600'
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className='w-40'
                                align='end'>
                                <DropdownMenuItem
                                    className='py-2 cursor-pointer hover:bg-gray-100'
                                    asChild>
                                    <Link href={`/admin/roles/${row.original.id}/edit`}>
                                        <Pencil
                                            height={16}
                                            width={16}
                                        />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className='py-2 text-red-500 cursor-pointer'
                                    onClick={() => handleDeleteClick(role)}>
                                    <Trash2
                                        height={16}
                                        width={16}
                                    />{' '}
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];
};
