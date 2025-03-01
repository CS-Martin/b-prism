'use client';

import { SidebarProvider } from '@b-prism/shadcn-ui/index';
import { AppSidebar } from '../../components/sidebar';
import { getServerSession } from 'next-auth';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar setSelectedAction={() => null} />
            <main className='w-full'>{children}</main>
        </SidebarProvider>
    );
}
