import Topbar from 'apps/web-app/src/components/topbar';
import { RoleManagementContent } from './_components/role-management-datatable';
import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';

export default async function RoleManagementPage() {
    const session = await getServerSession(options);

    return (
        <main className='px-3'>
            <Topbar
                items={[
                    { label: 'Admin', href: '/' },
                    { label: 'Role Management', href: '/admin/dashboard' },
                ]}
            />

            {session && session.user.role === 'admin' ? (
                <RoleManagementContent session={session} />
            ) : (
                <div className='flex items-center justify-center h-screen'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold'>Access Denied</h1>
                        <p className='mt-2'>You do not have permission to view this page.</p>
                    </div>
                </div>
            )}
        </main>
    );
}
