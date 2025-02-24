'use client';

import { useDisplayUsers } from '@b-prism/web-app/admin-dashboard-hooks';
import { DataTable } from './_components/data-table';
import { createColumns } from './_components/columns';
import { UserRole } from '@b-prism/enums';
import Topbar from 'apps/web-app/src/components/topbar';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function AdminDashboard() {
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (router.query.error) {
            toast({ title: 'Unauthorized Access', description: 'Redirecting to home.', variant: 'destructive' });
        }
    }, [router.query.error]);

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
        <div className='px-3'>
            <Topbar
                items={[
                    { label: 'Admin', href: '/' },
                    { label: 'Admin Dashboard', href: '/admin/dashboard' },
                ]}
            />
            <div className='prism-card-bg p-5 rounded-md mt-5'>
                <DataTable
                    columns={columns}
                    data={users}
                    handleRoleChange={handleRoleChange}
                />
            </div>
        </div>
    );
}
