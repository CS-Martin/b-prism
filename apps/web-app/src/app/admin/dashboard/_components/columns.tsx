'use client';

import { ColumnDef } from '@tanstack/react-table';

import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@b-prism/shadcn-ui/index';
import { UserRole } from '@b-prism/enums';
import { UserDto } from '@dto';

export const createColumns = (
    handleRoleChange: (userId: string, newRole: UserRole) => void,
): ColumnDef<Partial<UserDto>>[] => [
    {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'given_name',
        header: 'Name',
    },
    {
        accessorKey: 'family_name',
        header: 'Surname',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'office',
        header: 'Office',
    },
    {
        accessorKey: 'position',
        header: 'Position',
    },
    {
        accessorKey: 'id_image_url',
        header: 'ID Image',
    },
    {
        accessorKey: 'role',
        header: 'Role',
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
            const user = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant='outline'>Actions</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-32 rounded-[8px]'>
                        {Object.values(UserRole).map(
                            (role) =>
                                user.role !== role && (
                                    <DropdownMenuItem
                                        className='cursor-pointer'
                                        key={role}
                                        onClick={() => handleRoleChange(user.id ?? '', role)}
                                    >
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
            );
        },
    },
];
