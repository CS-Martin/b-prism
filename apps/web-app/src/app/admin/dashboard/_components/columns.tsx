'use client';

import { ColumnDef, Row } from '@tanstack/react-table';

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@b-prism/shadcn-ui/index';
import { UserRole } from '@b-prism/enums';
import { UserDto } from '@dto';
import { ArrowUpDown } from 'lucide-react';

const customRole = (rowA: Row<Partial<UserDto>>, rowB: Row<Partial<UserDto>>) => {
    const order = [UserRole.admin, UserRole.verified, UserRole.unverified];
    const aIndex = order.indexOf(rowA.original.role as UserRole);
    const bIndex = order.indexOf(rowB.original.role as UserRole);
    return aIndex - bIndex;
};

export const createColumns = (handleRoleChange: (userId: string, newRole: UserRole) => void): ColumnDef<Partial<UserDto>>[] => [
    {
        accessorKey: 'id',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className='rounded-sm'>
                    #
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
        cell: ({ row }) => row.index + 1,
        sortingFn: (rowA, rowB) => rowA.index - rowB.index,
    },
    {
        accessorKey: 'given_name',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className='rounded-sm'>
                    Name
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
    },
    {
        accessorKey: 'family_name',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className='rounded-sm'>
                    Surname
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className='rounded-sm'>
                    Email
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
    },
    {
        accessorKey: 'office',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className='rounded-sm'>
                    Office
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
    },
    {
        accessorKey: 'position',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className='rounded-sm'>
                    Position
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
    },
    {
        accessorKey: 'id_image_url',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className='rounded-sm'>
                    ID Image
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
    },
    {
        accessorKey: 'role',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className='rounded-sm'>
                    Role
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
        sortingFn: customRole,
    },
    {
        accessorKey: 'actions',
        header: '',
        cell: ({ row }) => {
            const user = row.original;

            return (
                <div className='flex justify-end'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline'>Actions</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className='w-32 rounded-sm'
                            align='end'>
                            {Object.values(UserRole).map(
                                (role) =>
                                    user.role !== role && (
                                        <DropdownMenuItem
                                            className='cursor-pointer'
                                            key={role}
                                            onClick={() => handleRoleChange(user.id ?? '', role)}>
                                            {(() => {
                                                switch (role) {
                                                    case UserRole.admin:
                                                        return 'Make Admin';
                                                    case UserRole.verified:
                                                        return 'Verify User';
                                                    case UserRole.unverified:
                                                        return 'Unverify User';
                                                    default:
                                                        return null;
                                                }
                                            })()}
                                        </DropdownMenuItem>
                                    ),
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];
