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

interface AppSidebarProps {
    setSelectedAction: (action: string | null) => void;
}

export function AppSidebar({ setSelectedAction }: AppSidebarProps) {
    const { data: session } = useSession();
    const { state } = useSidebar();
    const { toast } = useToast();
    const user = session?.user;
    const [selectedAction, setInternalSelectedAction] = useState<string | null>(null);

    const handleToggle = (action: string) => {
        const newAction = selectedAction === action ? null : action;
        setInternalSelectedAction(newAction);
        setSelectedAction(newAction);

        const actionData = mapActions.find((a) => a.id === newAction);
        if (actionData) {
            toast({
                title: actionData.toastTitle,
                description: actionData.toastDescription,
            });
        }
    };

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

                <SidebarMapActions
                    selectedAction={selectedAction}
                    handleToggle={handleToggle}
                />
            </SidebarContent>

            <SidebarFooterComponent user={user} />
        </Sidebar>
    );
}
