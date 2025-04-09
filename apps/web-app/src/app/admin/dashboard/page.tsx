import Topbar from 'apps/web-app/src/components/topbar';
import { DataTableContent } from './_components/data-table';
import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';

export default async function AdminDashboardPage() {
    const session = await getServerSession(options);

    return (
        <div>
            <Topbar
                items={[
                    { label: 'Admin', href: '/' },
                    { label: 'User Management', href: '/admin/dashboard' },
                ]}
            />

            {session && session.user.permissions.includes('USER_PERMISSION') ? (
                <DataTableContent session={session} />
            ) : (
                <div className='flex items-center justify-center h-screen'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold'>Access Denied</h1>
                        <p className='mt-2'>You do not have permission to view this page.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
