'use client';

import { UserDto } from '@dto';

import {
    Button,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@b-prism/shadcn-ui/index';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@b-prism/shadcn-ui/index';

import { UserRole } from '@b-prism/enums';
import { useDisplayUsers } from '@b-prism/web-app/admin-dashboard-hooks';
import { Breadcrumbs } from 'apps/web-app/src/components/breadcrumbs';

type User = UserDto;

export default function AdminDashboard() {
    const { users, isLoading, fetchAllUsers } = useDisplayUsers();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        await fetch('http://localhost:3002/verification/verify', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, role: newRole }),
        });

        fetchAllUsers();
    };

    return (
        <div>
            <Breadcrumbs
                className='p-7'
                items={[
                    { label: 'Admin', href: '/admin/dashboard' },
                    { label: 'Dashboard', href: '/admin/dashboard' },
                ]}
            />
            <div className='p-7'>
                <h1>Admin Dashboard</h1>

                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-[100px]'>#</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Surename</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Office</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>ID Image</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className='text-right'>Actions</TableHead>
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
                                <TableCell className='text-right'>
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
                                                            onClick={() => handleRoleChange(user.id, role)}
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
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
