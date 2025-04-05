import Topbar from 'apps/web-app/src/components/topbar';
import RescueManagementDashboard from './rescue-management-dashboard';

export default function RescueManagementPage() {
    return (
        <>
            <Topbar
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Rescue Management', href: '/rescue-management/dashboard' },
                    { label: 'Dashboard', href: '/rescue-management/dashboard' },
                ]}
            />
            <RescueManagementDashboard />
        </>
    );
}
