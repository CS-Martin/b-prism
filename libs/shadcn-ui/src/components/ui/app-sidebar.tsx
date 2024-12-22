'use client';

import { useSession } from 'next-auth/react';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
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
    Switch,
} from '@b-prism/shadcn-ui/index';
import { useState } from 'react';
import { ChevronUp, Home, LayoutDashboard, LogIn, LogOut, LucideIcon, Map, MapPinned, MapPinPlus, MapPinXInside, MonitorCog } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@b-prism/shadcn-ui/index';
import { UserDto } from '@dto';
import Link from 'next/link';

interface AppSidebarProps {
    setSelectedAction: (action: string | null) => void;
}

const Links = [
    {
        id: 'home',
        label: 'Home',
        icon: Home,
        href: '/home',
    },
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/dashboard',
    },
    {
        id: 'map',
        label: 'Map',
        icon: Map,
        href: '/map',
    },
    {
        id: 'admin-dashboard',
        label: 'Admin Dashboard',
        icon: MonitorCog,
        href: '/admin/dashboard',
    },
];

const actions = [
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

    const handleToggle = (action: string) => {
        const newAction = selectedAction === action ? null : action;
        setInternalSelectedAction(newAction);
        setSelectedAction(newAction);

        const actionData = actions.find((a) => a.id === newAction);
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
            <SidebarHeader>LOGO</SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Links</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className='gap-2'>
                            {Links.map((link) => (
                                <SidebarLinkItem
                                    key={link.id}
                                    {...link}
                                />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel style={{ display: user?.role !== 'admin' && user?.role !== 'verified' ? 'none' : 'block' }}>Actions</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className='gap-2'>
                            {actions.map((action) => (
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
                    </SidebarGroupContent>
                </SidebarGroup>
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
                                side='right'
                                align='start'
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
