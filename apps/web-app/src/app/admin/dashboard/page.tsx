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

import { useDisplayUsers } from '@b-prism/web-app/admin-dashboard-hooks';
import { DataTable } from './_components/data-table';
import { createColumns } from './_components/columns';
import { UserRole } from '@b-prism/enums';

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

    const columns = createColumns(handleRoleChange);

    return (
        <div className='p-7'>
            <DataTable
                columns={columns}
                data={users}
                handleRoleChange={handleRoleChange}
            />
        </div>
    );
}
