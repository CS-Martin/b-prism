import Topbar from 'apps/web-app/src/components/topbar';
import { DataTableContent } from './_components/data-table';
import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';

export default async function AdminDashboardPage() {
    const session = await getServerSession(options);

    console.log(session);

    return (
        <div className='px-3'>
            <Topbar
                items={[
                    { label: 'Admin', href: '/' },
                    { label: 'Admin Dashboard', href: '/admin/dashboard' },
                ]}
            />

            <DataTableContent session={session} />
        </div>
    );
}
