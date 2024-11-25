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
import {
    ChevronUp,
    Home,
    LayoutDashboard,
    LogIn,
    LogOut,
    Map,
    MapPinned,
    MapPinPlus,
    MapPinXInside,
    MonitorCog,
    User,
    Warehouse,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@b-prism/shadcn-ui/index';
import { UserDto } from '@dto';
import Link from 'next/link';

interface AppSidebarProps {
    setSelectedAction: (action: string | null) => void;
}

const Links = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: Home,
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
    icon: React.ElementType;
    selectedAction: string | null;
    handleToggle: (action: string) => void;
}

interface SidebarLinkItemProps {
    label: string;
    icon: React.ElementType;
    href: string;
}

function SidebarLinkItem({ label, icon: Icon, href }: SidebarLinkItemProps) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton className='p-0'>
                <a
                    href={href}
                    className='flex items-center space-x-3 w-full'
                >
                    <Icon className='w-5 h-5' />
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
            <div className='flex justify-between items-center space-x-2'>
                <span className='flex items-center space-x-2'>
                    <Icon className='w-5 h-5' />
                    <span>{label}</span>
                </span>
                <Switch
                    id={id}
                    checked={selectedAction === id}
                    onChange={() => handleToggle(id)}
                />
            </div>
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
        <Sidebar>
            <SidebarHeader>HEADER</SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className='p-0'>Links</SidebarGroupLabel>
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
                    <SidebarGroupLabel
                        className='p-0'
                        style={{ display: user?.role !== 'admin' && user?.role !== 'verified' ? 'none' : 'block' }}
                    >
                        Actions
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className='gap-5'>
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
                <div className='flex items-center justify-between space-x-2 p-5 border-2 border-gray-400 rounded-xl border-dashed'>
                    <span>Dark Mode</span>
                    <ModeToggle />
                </div>
                <SidebarMenu className='py-1'>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className='h-auto'>
                                    <Avatar style={{ borderRadius: 'var(--radius)' }}>
                                        <AvatarImage src='https://github.com/shadcn.png' />
                                        <AvatarFallback>US</AvatarFallback>
                                    </Avatar>
                                    {`${user?.given_name || ''} ${user?.family_name || ''}`}
                                    <ChevronUp className='ml-auto' />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side='right'
                                align='start'
                                className='w-[--radix-popper-anchor-width]'
                                style={{ borderRadius: 'var(--radius)' }}
                            >
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    {session ? (
                                        <>
                                            <Link
                                                href='/api/auth/signout'
                                                className='w-full flex items-center space-x-2'
                                            >
                                                <LogOut />
                                                <span>Log out</span>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href='/auth/login'
                                                className='w-full flex items-center space-x-2'
                                            >
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
