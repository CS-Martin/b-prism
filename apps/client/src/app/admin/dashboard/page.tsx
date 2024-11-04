'use client';

import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';
import { UserDto } from '@dto';
import { useEffect, useState } from 'react';

import {
    Button,
    DropdownMenuPortal,
    DropdownMenuSubTrigger,
    DropdownMenuSub,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    DropdownMenuSubContent,
} from '@b-prism/ui-components';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
    DropdownMenuShortcut,
} from '@b-prism/ui-components';

import { UserRole } from '@b-prism/enums';
import { useSession } from 'next-auth/react';
import { useDisplayUsers } from 'apps/client/src/hooks/admin-dashboard.hook';
import { verificationService } from 'apps/client/src/services/verification-service';

type User = UserDto;

export default function AdminDashboard() {
    const session = useSession().data?.user;

    const { users, isLoading } = useDisplayUsers();

    const handleRoleChange = (userId: string, newRole: UserRole) => {
        console.log(`Changing role for user ${userId} to ${newRole}`);

        verificationService.roleChange(userId, newRole);
    };

    return (
        <div className="p-10">
            <h1>Admin Dashboard</h1>

            <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Surename</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Office</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>ID Image</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user: User, index: number) => (
                        <TableRow key={user.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{user.given_name}</TableCell>
                            <TableCell>{user.family_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.office}</TableCell>
                            <TableCell>{user.position}</TableCell>
                            <TableCell>{user.id_image_url}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            Actions
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-32 rounded-[8px]">
                                        {Object.values(UserRole).map(
                                            (role) =>
                                                user.role !== role && (
                                                    <DropdownMenuItem
                                                        key={role}
                                                        onClick={() =>
                                                            handleRoleChange(
                                                                user.id,
                                                                role
                                                            )
                                                        }
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
                                                )
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
