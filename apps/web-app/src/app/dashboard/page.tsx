import Topbar from '../../components/topbar';
import DashboardContent from './dashboard-content';

export default async function DashboardPage() {
    //  --- Do server logic here ---

    return (
        <main>
            <Topbar
                items={[
                    { label: 'Home', href: '/' },
                    { label: 'Analytical Dashboard', href: '/dashboard' },
                ]}
            />
            <DashboardContent />
        </main>
    );
}
