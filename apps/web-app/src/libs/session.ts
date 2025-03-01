import { getServerSession } from 'next-auth';
import { options } from '../app/api/auth/[...nextauth]/options';

export async function getCurrentSession() {
    const session = await getServerSession(options);

    return session?.user;
}
