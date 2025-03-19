import { CreateRoleContent } from './_components/create-role';
import Topbar from 'apps/web-app/src/components/topbar';

export default function CreateRolePage() {
    return (
        <main className='px-3'>
            <Topbar
                items={[
                    { label: 'Admin', href: '/' },
                    { label: 'Role Management', href: '/admin/roles' },
                ]}
            />

            <CreateRoleContent />
        </main>
    );
}
