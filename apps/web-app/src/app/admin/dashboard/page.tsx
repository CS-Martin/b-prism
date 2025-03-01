import Topbar from 'apps/web-app/src/components/topbar';
import { getCurrentSession } from 'apps/web-app/src/libs/session';
import { notFound } from 'next/navigation';
import { DataTableContent } from './_components/data-table';

export default async function AdminDashboardPage() {
    return (
        <div className='px-3'>
            <Topbar
                items={[
                    { label: 'Admin', href: '/' },
                    { label: 'Admin Dashboard', href: '/admin/dashboard' },
                ]}
            />

            <DataTableContent />
        </div>
    );
}
