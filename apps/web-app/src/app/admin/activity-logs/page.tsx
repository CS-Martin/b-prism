import { getServerSession } from 'next-auth';
import { options } from '../../api/auth/[...nextauth]/options';
import ActivityLog from './_components/activity-log';

export default async function ActivityLogsPage() {
    const session = await getServerSession(options);

    return <ActivityLog token={session?.user.access_token} />;
}
