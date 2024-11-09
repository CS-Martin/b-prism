'use client';

import { AppSidebar } from '@b-prism/shadcn-ui/index';
import Mapbox from './_components/mapbox';
import { useState } from 'react';
import { SelectedActionType } from '@b-prism/enums';

const MapPage = () => {
    const [selectedAction, setSelectedAction] = useState<SelectedActionType | null>(null);

    return (
        <main className=''>
            <Mapbox selectedAction={selectedAction} />
            <AppSidebar
                setSelectedAction={(action: string | null) => setSelectedAction(action as SelectedActionType | null)}
            />
        </main>
    );
};
export default MapPage;
