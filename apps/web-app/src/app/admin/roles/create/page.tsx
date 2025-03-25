import { getServerSession } from 'next-auth';
import { CreateRoleContent } from './_components/create-role';
import Topbar from 'apps/web-app/src/components/topbar';
import { options } from '../../../api/auth/[...nextauth]/options';

export default async function CreateRolePage() {
    const session = await getServerSession(options);

    return (
        <main className='px-3'>
            <Topbar
                items={[
                    { label: 'Admin', href: '/' },
                    { label: 'Role Management', href: '/admin/roles' },
                    { label: 'Create Role', href: '/admin/roles/create' },
                ]}
            />

            {session && session.user.permissions.includes('ROLE_PERMISSION') ? (
                <CreateRoleContent session={session} />
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
