import { useDisplayActivityLogs } from 'apps/web-app/src/hooks/activity-log.hook';
import { getServerSession } from 'next-auth';
import { getSession, useSession } from 'next-auth/react';
import { options } from '../../api/auth/[...nextauth]/options';

export default async function ActivityLogsPage() {
    const session = await getServerSession(options);

    // console.log('HEY', session, 'HAAHAHHAHA');
    // const { logs, isLoading } = useDisplayActivityLogs();

    // if (isLoading) {
    //     return <div>Loading..</div>;
    // }

    // return <ActivityLog initialLogs={logs} />;

    return;
}
