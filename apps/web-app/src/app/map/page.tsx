'use client';

import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options';
import { MapboxContext } from './_components/mapbox';
import { cookies } from 'next/headers';
import { NextStep, NextStepProvider } from 'nextstepjs';
import { useSession } from 'next-auth/react';

export default function MapPage() {
    const { data: session } = useSession();
    // const cookie = await cookies();

    // Check if user first time login
    // If first time, start onboarding
    // const firstMapVisit = cookie.get('firstMapVisit');
    // if (!firstMapVisit) {
    //     cookie.set('firstMapVisit', 'true', { path: '/', maxAge: 60 * 30 });
    // } else {
    // }

    return <MapboxContext session={session} />;
}
