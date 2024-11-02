'use client';

import Link from 'next/link';
import { options } from './api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';

export default function Home() {
    const session = useSession();
    console.log('session', session);

    return (
        <div>
            <Link href="/dashboard">Dashboard</Link>
            <p>hi {session?.data?.user?.email}</p>
        </div>
    );
}
