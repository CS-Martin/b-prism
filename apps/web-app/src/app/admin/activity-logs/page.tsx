import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';
import ActivityLog from './_components/activity-log';

export default async function ActivityLogsPage() {
    const session = await getServerSession(options);

    return (
        <>
            {session && session.user.permissions.includes('ACTIVITY_LOG_PERMISSION') ? (
                <ActivityLog token={session?.user.access_token} />
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
