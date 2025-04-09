import Topbar from 'apps/web-app/src/components/topbar';
import RescueManagementDashboard from './rescue-management-dashboard';
import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';

export default async function RescueManagementPage() {
    const session = await getServerSession(options);

    return (
        <>
            <Topbar
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Rescue Management', href: '/rescue-management/dashboard' },
                    { label: 'Dashboard', href: '/rescue-management/dashboard' },
                ]}
            />
            <RescueManagementDashboard session={session} />
        </>
    );
}
