'use client';

import { AppSidebar } from '@b-prism/shadcn-ui/index';
import Mapbox from './_components/mapbox';
import { useState } from 'react';

const MapPage = () => {
    const [selectedAction, setSelectedAction] = useState<string | null>(null);

    return (
        <main className=''>
            <Mapbox selectedAction={selectedAction} />
            <AppSidebar setSelectedAction={setSelectedAction} />
        </main>
    );
};
export default MapPage;
