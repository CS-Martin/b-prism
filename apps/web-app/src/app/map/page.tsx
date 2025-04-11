'use client';

import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';

const MapboxContext = dynamic(() => import('./_components/mapbox').then((mod) => mod.MapboxContext), {
    ssr: false,
});

export default function MapPage() {
    const { data: session } = useSession();

    return <MapboxContext session={session} />;
}
