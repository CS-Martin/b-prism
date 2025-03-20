import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@b-prism/shadcn-ui/index';
import { EllipsisVertical } from 'lucide-react';
import Link from 'next/link';

export const CreateRoleDatatableColumns = () => {
    return [
        {
            accessorKey: 'name',
            header: 'Role Name',
            cell: ({ row }: { row: any }) => <div className='font-semibold text-gray-800'>{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'description',
            header: 'Role Description',
            cell: ({ row }: { row: any }) => <div className='text-gray-600'>{row.getValue('description')}</div>,
        },
        {
            accessorKey: 'permissions',
            header: 'Permissions',
            cell: ({ row }: { row: any }) => (
                <div className='flex flex-wrap gap-2'>
                    {row.getValue('permissions').map((permission: string, index: number) => (
                        <span
                            key={index}
                            className='px-2 py-1 text-sm text-blue-800 bg-blue-100 rounded-full'>
                            {permission}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Created Date',
            cell: ({ row }: { row: any }) => {
                const date = new Date(row.getValue('created_at') as string);
                return (
                    <div className='text-gray-600'>
                        {date.toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        })}
                    </div>
                );
            },
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }: { row: any }) => {
                const role = row.original;

                return (
                    <div className='flex justify-end'>
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
                            <DropdownMenuContent className='w-40'>
                                <DropdownMenuItem
                                    className='cursor-pointer hover:bg-gray-100'
                                    asChild>
                                    <Link href={`/admin/roles/${row.original.id}/edit`}>Edit</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className='cursor-pointer hover:bg-gray-100'>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];
};
