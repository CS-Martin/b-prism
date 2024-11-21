'use client';

import { AppSidebar, SidebarProvider } from '@b-prism/shadcn-ui/index';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar setSelectedAction={() => null} />
            <main className='w-full overflow-y-auto'>{children}</main>
        </SidebarProvider>
    );
}
