import Link from 'next/link';
import { options } from '../api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default async function Dashboard() {
    const session = await getServerSession(options);

    return (
        <div>
            <h1>Dashboard</h1>
            {session?.user ? (
                <div>
                    <p>Hi {session.user.email}</p>
                </div>
            ) : (
                <p>User not logged in</p>
            )}

            <Link href="/auth/register">Register</Link>
            <Link href="/auth/login">Login</Link>
            <Link href="/api/auth/signout">Logout</Link>
        </div>
    );
}
