'use client';

import { useSession } from 'next-auth/react';
import { Sidebar, SidebarContent, useSidebar } from '@b-prism/shadcn-ui/index';
import { SidebarHeaderComponent } from './sidebar-components/sidebar-header';
import { SidebarGeneralLinks } from './sidebar-components/sidebar-general-links';
import { SidebarAdminLinks } from './sidebar-components/sidebar-admin-links';
import { SidebarMapActions } from './sidebar-components/sidebar-map-actions';
import { SidebarFooterComponent } from './sidebar-components/sidebar-footer';
import { Session } from 'next-auth';

interface AppSirebarProps {
    session: Session;
}
export function AppSidebar({ session }: AppSirebarProps) {
    const { state } = useSidebar();

    return (
        <Sidebar
            variant='floating'
            collapsible='icon'>
            <SidebarContent>
                <SidebarHeaderComponent />

                <SidebarGeneralLinks />

                <hr className={`border-t ${state === 'collapsed' ? 'mx-[20%]' : 'mx-[5%]'}`} />

                <SidebarAdminLinks />

                <hr className={`border-t ${state === 'collapsed' ? 'mx-[20%]' : 'mx-[5%]'}`} />

                <SidebarMapActions />
            </SidebarContent>

            <SidebarFooterComponent user={session.user} />
        </Sidebar>
    );
}
