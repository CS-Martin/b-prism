import Topbar from 'apps/web-app/src/components/topbar';
import { UpdateRoleContent } from './_components/update-role';

export default function EditRolePage() {
    return (
        <main>
            <Topbar
                items={[
                    { label: 'Admin', href: '/' },
                    { label: 'Role Management', href: '/admin/roles' },
                    { label: 'Edit Role', href: '/admin/roles/[roleId]/edit' },
                ]}
            />
            <UpdateRoleContent />
        </main>
    );
}
