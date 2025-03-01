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
import { ChartNoAxesCombined, ChevronDown, Home, Map } from 'lucide-react';
import { motion } from 'framer-motion';
import { SidebarLinkItem } from './sidebar-link-item';

const generalLinks = [
    {
        id: 'home',
        label: 'Home',
        icon: Home,
        href: '/home',
    },
    {
        id: 'dashboard',
        label: 'Resources Dashboard',
        icon: ChartNoAxesCombined,
        href: '/dashboard',
    },
    {
        id: 'map',
        label: 'Map',
        icon: Map,
        href: '/map',
    },
];

export const SidebarGeneralLinks = () => {
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
                                <SidebarGroupLabel className='px-0'>General</SidebarGroupLabel>
                                <ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent asChild>
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className='overflow-hidden'>
                                <SidebarMenu className='gap-2'>
                                    {generalLinks.map((link) => (
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
