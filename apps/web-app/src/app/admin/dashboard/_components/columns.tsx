'use client';

import { ColumnDef, Row } from '@tanstack/react-table';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Label,
} from '@b-prism/shadcn-ui/index';
import { UserRole } from '@b-prism/enums';
import { UserDto } from '@dto';
import { ArrowUpDown, EllipsisVertical } from 'lucide-react';
import Image from 'next/image';

const customRole = (rowA: Row<Partial<UserDto>>, rowB: Row<Partial<UserDto>>) => {
    const order = [UserRole.admin, UserRole.verified, UserRole.unverified];
    const aIndex = order.indexOf(rowA.original.role as UserRole);
    const bIndex = order.indexOf(rowB.original.role as UserRole);
    return aIndex - bIndex;
};

export const createColumns = (handleRoleChange: (userId: string, newRole: UserRole) => void): ColumnDef<Partial<UserDto>>[] => [
    {
        accessorKey: 'given_name',
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className='flex flex-row justify-between w-full rounded-sm'>
                    Name
                    <ArrowUpDown className='w-4 h-4 ml-2' />
                </Button>
            );
        },

        cell: ({ row }) => {
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
                            <span className='font-semibold'>{`${row.original.given_name + ' ' + row.original.family_name}`}</span>
                            <Label className='text-xs'>{row.original.email}</Label>
                        </div>
                    </span>
                </div>
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
                    <ArrowUpDown className='w-4 h-4 ml-2' />
                </Button>
            );
        },
        sortingFn: customRole,
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
                    <ArrowUpDown className='w-4 h-4 ml-2' />
                </Button>
            );
        },
    },
    {
        accessorKey: 'position',
        header: ({ column }) => {
            return (
                <div className='text-center'>
                    <Button
                        variant='ghost'
                        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                        className='rounded-sm'>
                        Position
                        <ArrowUpDown className='w-4 h-4 ml-2' />
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => {
            const position: string | undefined | null = row.original.position;

            return (
                <div className='text-center'>
                    <p>{position}</p>
                </div>
            );
        },
    },
    {
        accessorKey: 'id_image_url',
        header: ({ column }) => {
            return (
                <div className='p-4 text-center'>
                    <p>ID Image</p>
                </div>
            );
        },
        cell: ({ row }) => {
            const user = row.original;

            return (
                <div className='text-center'>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant='outline'>View Image</Button>
                        </DialogTrigger>
                        <DialogContent className=''>
                            <DialogHeader>
                                <DialogTitle>test</DialogTitle>
                                <DialogDescription>test</DialogDescription>
                            </DialogHeader>
                            <div className='h-full'>
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_UPLOADTHING_URL}${user.id_image_url}`}
                                    height={500}
                                    width={500}
                                    alt={`${user.given_name} ${user.family_name} identification image.`}
                                    className=' max-h-[200px] object-cover'
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            );
        },
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
