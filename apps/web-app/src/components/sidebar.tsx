'use client';

import { useSession } from 'next-auth/react';
import { Sidebar, SidebarContent, useSidebar } from '@b-prism/shadcn-ui/index';
import { SidebarHeaderComponent } from './sidebar-components/sidebar-header';
import { SidebarGeneralLinks } from './sidebar-components/sidebar-general-links';
import { SidebarAdminLinks } from './sidebar-components/sidebar-admin-links';
import { SidebarMapActions } from './sidebar-components/sidebar-map-actions';
import { SidebarFooterComponent } from './sidebar-components/sidebar-footer';

export function AppSidebar() {
    const { data: session } = useSession();
    const { state } = useSidebar();
    const user = session?.user;

    return (
        <Sidebar
            variant='sidebar'
            collapsible='icon'>
            <SidebarContent>
                <SidebarHeaderComponent />

                <SidebarGeneralLinks />

                <hr className={`border-t ${state === 'collapsed' ? 'mx-[20%]' : 'mx-[5%]'}`} />

                <SidebarAdminLinks />

                <hr className={`border-t ${state === 'collapsed' ? 'mx-[20%]' : 'mx-[5%]'}`} />

                {session && <SidebarMapActions session={session} />}
            </SidebarContent>

            <SidebarFooterComponent user={user} />
        </Sidebar>
    );
}
