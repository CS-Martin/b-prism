'use client';

import { useSession } from 'next-auth/react';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    DropdownMenuItem,
    ModeToggle,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    Switch,
    useSidebar,
} from '@b-prism/shadcn-ui/index';
import { useState } from 'react';
import {
    Bell,
    ChartArea,
    ChartNoAxesCombined,
    ChevronDown,
    ChevronUp,
    History,
    Home,
    LayoutDashboard,
    LogIn,
    LogOut,
    LucideIcon,
    Map,
    MapPinned,
    MapPinPlus,
    MapPinXInside,
    MonitorCog,
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@b-prism/shadcn-ui/index';
import { UserDto } from '@dto';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface AppSidebarProps {
    setSelectedAction: (action: string | null) => void;
}

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

const adminLinks = [
    {
        id: 'admin-dashboard',
        label: 'Admin Dashboard',
        icon: MonitorCog,
        href: '/admin/dashboard',
    },
    {
        id: 'activity-logs',
        label: 'Activity Logs',
        icon: History,
        href: '/admin/activity-logs',
    },
];

const mapActions = [
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
];

interface SidebarActionItemProps {
    id: string;
    label: string;
    icon: LucideIcon;
    selectedAction: string | null;
    handleToggle: (action: string) => void;
}

interface SidebarLinkItemProps {
    label: string;
    icon: LucideIcon;
    href: string;
}

function SidebarLinkItem({ label, icon: Icon, href }: SidebarLinkItemProps) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild>
                <a
                    href={href}
                    className='flex items-center'>
                    <Icon style={{ height: '18px', width: '18px' }} />
                    <span>{label}</span>
                </a>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function SidebarActionItem({ id, label, icon: Icon, selectedAction, handleToggle }: SidebarActionItemProps) {
    const { data: session } = useSession();
    const user: UserDto = session?.user as UserDto;

    if (user?.role !== 'admin' && user?.role !== 'verified') {
        return null;
    }

    return (
        <SidebarMenuItem onClick={() => handleToggle(id)}>
            <SidebarMenuButton className='flex justify-between hover:bg-transparent'>
                <Icon style={{ height: '18px', width: '18px' }} />
                <span className='flex-1'>{label}</span>

                <Switch
                    id={id}
                    checked={selectedAction === id}
                    onChange={() => handleToggle(id)}
                />
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function AppSidebar({ setSelectedAction }: AppSidebarProps) {
    const { data: session } = useSession();
    const { toast } = useToast();
    const user: UserDto = session?.user as UserDto;
    const [selectedAction, setInternalSelectedAction] = useState<string | null>(null);
    const { state } = useSidebar();

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
            <SidebarHeader className='pt-5'>
                <SidebarMenuButton
                    size='lg'
                    className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                    {/* className={`transition-all duration-300 ease-in-out bg-blue-600 rounded-sm flex items-center justify-center ${state === 'collapsed' ? '' : 'h-10 w-10'}`}> */}
                    <div className='flex size-11 items-center justify-center shadow-xl rounded-lg bg-blue-600 text-sidebar-primary-foreground'>
                        <Image
                            src={'/logo/haribon-logo.svg'}
                            height={24}
                            width={24}
                            alt='haribon logo'
                            className={`${state === 'collapsed' ? 'size-6' : 'size-7'}`}
                        />
                    </div>
                    <div className={`grid flex-1 text-left text-sm leading-relaxed ${state === 'collapsed' ? 'hidden' : 'block'}`}>
                        <span className='truncate text-xs'>Project</span>
                        <span className='truncate font-bold'>HARIBON</span>
                    </div>
                    <Bell size={24} />
                </SidebarMenuButton>
            </SidebarHeader>

            <SidebarContent>
                {/* General Links */}
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

                {/* When sidebar state is close, display a horizontal bar or line to separate the link group */}
                <hr className={`border-t ${state === 'collapsed' ? 'mx-[20%]' : 'mx-[5%]'}`} />

                {/* Admin Links */}
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

                <hr className={`border-t ${state === 'collapsed' ? 'mx-[20%]' : 'mx-[5%]'}`} />

                {(user?.role === 'admin' || user?.role === 'verified') && (
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
                                                        selectedAction={selectedAction}
                                                        handleToggle={handleToggle}
                                                    />
                                                ))}
                                            </SidebarMenu>
                                        </motion.div>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>
            <SidebarFooter>
                <div className='flex items-center justify-between p-5 border-2 border-gray-400 rounded-xl border-dashed group-data-[state=collapsed]:hidden'>
                    <span className='group-data-[state=expanded]:inline hidden'>Dark Mode</span>
                    <ModeToggle />
                </div>
                <SidebarMenu className='py-1'>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className='flex items-center h-auto group-data-[state=collapsed]:!p-0'>
                                    <Avatar style={{ borderRadius: '3px' }}>
                                        <AvatarImage src='https://github.com/shadcn.png' />
                                        <AvatarFallback>US</AvatarFallback>
                                    </Avatar>
                                    <span className='group-data-[state=collapsed]:hidden ml-2'>{`${user?.given_name || ''} ${user?.family_name || ''}`}</span>
                                    <ChevronUp className='ml-auto group-data-[state=collapsed]:hidden' />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side='top'
                                align='end'
                                className='w-[--radix-popper-anchor-width]'
                                style={{ borderRadius: 'var(--radius)' }}>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    {session ? (
                                        <>
                                            <Link
                                                href='/api/auth/signout'
                                                className='w-full flex items-center space-x-2'>
                                                <LogOut />
                                                <span>Log out</span>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href='/auth/login'
                                                className='w-full flex items-center space-x-2'>
                                                <LogIn />
                                                <span>Sign in</span>
                                            </Link>
                                        </>
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
