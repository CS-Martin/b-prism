'use client';

import { useSession } from 'next-auth/react';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { Sidebar, SidebarContent, useSidebar } from '@b-prism/shadcn-ui/index';
import { useState } from 'react';
import { SidebarHeaderComponent } from './sidebar-components/sidebar-header';
import { SidebarGeneralLinks } from './sidebar-components/sidebar-general-links';
import { SidebarAdminLinks } from './sidebar-components/sidebar-admin-links';
import { mapActions, SidebarMapActions } from './sidebar-components/sidebar-map-actions';
import { SidebarFooterComponent } from './sidebar-components/sidebar-footer';

export function AppSidebar() {
    const { data: session } = useSession();
    const { state } = useSidebar();
    const user = session?.user;

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

            <SidebarFooterComponent user={user} />
        </Sidebar>
    );
}
