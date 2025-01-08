'use client';

import { AppSidebar, SidebarProvider } from '@b-prism/shadcn-ui/index';
import Topbar from 'apps/web-app/src/components/topbar';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar setSelectedAction={() => null} />
            <main className='w-full'>{children}</main>
        </SidebarProvider>
    );
}
