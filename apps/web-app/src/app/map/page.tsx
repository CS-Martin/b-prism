import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options';
import { MapboxContext } from './_components/mapbox';

export default async function MapPage() {
    const session = await getServerSession(options);

    return <MapboxContext session={session} />;
}
