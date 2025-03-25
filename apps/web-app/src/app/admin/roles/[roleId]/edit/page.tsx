import Topbar from 'apps/web-app/src/components/topbar';
import { UpdateRoleContent } from './_components/update-role';
import { getServerSession } from 'next-auth';
import { options } from 'apps/web-app/src/app/api/auth/[...nextauth]/options';

export default async function EditRolePage() {
    const session = await getServerSession(options);

    return (
        <main className='px-3'>
            <Topbar
                items={[
                    { label: 'Admin', href: '/' },
                    { label: 'Role Management', href: '/admin/roles' },
                    { label: 'Edit Role', href: '/admin/roles/[roleId]/edit' },
                ]}
            />

            {session && session.user.permissions.includes('ROLE_PERMISSION') ? (
                <UpdateRoleContent session={session} />
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
