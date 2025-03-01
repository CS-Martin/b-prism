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
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@b-prism/shadcn-ui/index';
import { useState } from 'react';
import { ChevronUp, LogIn, LogOut } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@b-prism/shadcn-ui/index';
import Link from 'next/link';
import { SidebarHeaderComponent } from './sidebar-components/sidebar-header';
import { SidebarGeneralLinks } from './sidebar-components/sidebar-general-links';
import { SidebarAdminLinks } from './sidebar-components/sidebar-admin-links';
import { mapActions, SidebarMapActions } from './sidebar-components/sidebar-map-actions';
import { getServerSession } from 'next-auth';
import { options } from '../app/api/auth/[...nextauth]/options';

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
                                        <AvatarFallback>{user ? `${user?.given_name?.[0]}${user?.family_name?.[0]}` : 'GE'}</AvatarFallback>
                                    </Avatar>
                                    <span className='group-data-[state=collapsed]:hidden ml-2'>{`${user?.given_name || 'Guest'} ${user?.family_name || 'User'}`}</span>
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
