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
import { motion } from 'framer-motion';
import { ChevronDown, MapPinned, MapPinPlus, MapPinXInside, Route } from 'lucide-react';
import { SidebarActionItem } from './sidebar-action-item';
import { Session } from 'next-auth';

export const mapActions = [
    {
        id: 'createWarehouse',
        label: 'Create Warehouse',
        icon: MapPinPlus,
        toastTitle: 'Create Warehouse',
        toastDescription: 'Please click on the map to create a warehouse',
    },
    {
        id: 'createDispensingPoint',
        label: 'Create Dispensing Point',
        icon: MapPinned,
        toastTitle: 'Create Dispensing Point',
        toastDescription: 'Please click on the map to create a dispensing point',
    },
    {
        id: 'deleteItem',
        label: 'Delete Item',
        icon: MapPinXInside,
        toastTitle: 'Delete an Item',
        toastDescription: 'Please click on the item you want to delete',
    },
    {
        id: 'findRoute',
        label: 'Find Route',
        icon: Route,
        toastTitle: 'Find Route',
        toastDescription: 'Please click on the map to find a route',
    },
];

export const SidebarMapActions = ({ session }: { session?: Session }) => {
    const { state } = useSidebar();

    if (
        !session ||
        !session.user.permissions.includes('WAREHOUSE_PERMISSION') ||
        !session.user.permissions.includes('DISPENSING_POINT_PERMISSION') ||
        !session.user.permissions.includes('ROAD_NETWORK_PERMISSION')
    )
        return null;

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
                                <SidebarGroupLabel className='px-0'>Map Actions</SidebarGroupLabel>
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
                                    {mapActions.map((action) => (
                                        <SidebarActionItem
                                            key={action.id}
                                            id={action.id}
                                            label={action.label}
                                            icon={action.icon}
                                            toastTitle={action.toastTitle}
                                            toastDescription={action.toastDescription}
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
