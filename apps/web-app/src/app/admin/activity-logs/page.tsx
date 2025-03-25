import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';
import ActivityLog from './_components/activity-log';
import Topbar from 'apps/web-app/src/components/topbar';

export default async function ActivityLogsPage() {
    const session = await getServerSession(options);

    return (
        <>
            {session && session.user.permissions.includes('ACTIVITY_LOG_PERMISSION') ? (
                <div>
                    <Topbar
                        items={[
                            { label: 'Admin', href: '/' },
                            { label: 'Activity Logs History', href: '/admin/activity-logs' },
                        ]}
                    />
                    <ActivityLog token={session?.user.access_token} />
                </div>
            ) : (
                <div className='flex items-center justify-center h-screen'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-bold'>Access Denied</h1>
                        <p className='mt-2'>You do not have permission to view this page.</p>
                    </div>
                </div>
            )}
        </>
    );
}
