import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@b-prism/shadcn-ui/index';
import { ChevronDown, History, MonitorCog, UserCog } from 'lucide-react';
import { motion } from 'framer-motion';
import { SidebarLinkItem } from './sidebar-link-item';

const adminLinks = [
    {
        id: 'admin-dashboard',
        label: 'Admin Dashboard',
        icon: MonitorCog,
        href: '/admin/dashboard',
    },
    {
        id: 'role-management',
        label: 'Role Management',
        icon: UserCog,
        href: '/admin/roles',
    },
    {
        id: 'activity-logs',
        label: 'Activity Logs',
        icon: History,
        href: '/admin/activity-logs',
    },
    {
        id: 'rescue-dashboard',
        label: 'Rescue Dashboard',
        icon: MonitorCog,
        href: '/rescue-management/dashboard',
    },
];

export const SidebarAdminLinks = () => {
    const { state } = useSidebar();

    return (
        <SidebarGroup>
            <SidebarMenu>
                <Collapsible
                    defaultOpen
                    className='group/collapsible'>
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                                style={{ backgroundColor: 'transparent' }}
                                variant='default'
                                className={`${state === 'collapsed' ? 'hidden' : 'flex'}`}>
                                <SidebarGroupLabel className='px-0'>Admin</SidebarGroupLabel>
                                <ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className='overflow-hidden'>
                                <SidebarMenu className='gap-2'>
                                    {adminLinks.map((link) => (
                                        <SidebarLinkItem
                                            key={link.id}
                                            {...link}
                                        />
                                    ))}
                                </SidebarMenu>
                            </motion.div>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            </SidebarMenu>
        </SidebarGroup>
    );
};
