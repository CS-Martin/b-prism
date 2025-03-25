// app/components/admin-dashboard-wrapper.tsx (Client Component)
'use client';

import { AppSidebar } from '../sidebar';

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-1'>
            <AppSidebar />
            <main className='w-full overflow-y-hidden'>{children}</main>
        </div>
    );
}
