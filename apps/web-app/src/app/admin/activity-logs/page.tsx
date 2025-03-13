import { useDisplayActivityLogs } from 'apps/web-app/src/hooks/activity-log.hook';
import { getServerSession } from 'next-auth';
import { getSession, useSession } from 'next-auth/react';
import { options } from '../../api/auth/[...nextauth]/options';
import ActivityLog from './_components/activity-log';

export default async function ActivityLogsPage() {
    const session = await getServerSession(options);

    return <ActivityLog token={session?.user.accessToken} />;
}
