import Topbar from 'apps/web-app/src/components/topbar';
import { RoleManagementContent } from './_components/role-management-datatable';

export default function RoleManagementPage() {
    return (
        <main className='px-3'>
            <Topbar
                items={[
                    { label: 'Admin', href: '/' },
                    { label: 'Role Management', href: '/admin/dashboard' },
                ]}
            />

            <RoleManagementContent />
        </main>
    );
}
