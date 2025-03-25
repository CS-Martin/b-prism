import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    ModeToggle,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@b-prism/shadcn-ui/index';
import { ChevronUp, LogIn, LogOut } from 'lucide-react';
import { Session } from 'next-auth';
import Link from 'next/link';

interface SidebarFooterProps {
    user?: Session['user'];
}

export const SidebarFooterComponent = ({ user }: SidebarFooterProps) => {
    return (
        <div className='p-3 '>
            <div className='flex items-center justify-between p-5 border-2 border-gray-400 rounded-xl border-dashed group-data-[state=collapsed]:hidden'>
                <span className='group-data-[state=expanded]:inline'>Dark Mode</span>
                <ModeToggle />
            </div>
            <SidebarMenu className='py-1'>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton className='flex items-center h-auto group-data-[state=collapsed]:!p-0'>
                                <Avatar style={{ borderRadius: '3px' }}>
                                    <AvatarImage src='' />
                                    <AvatarFallback className='rounded-md'>{user ? `${user?.given_name?.charAt(0)}${user?.family_name?.charAt(0)}` : 'GE'}</AvatarFallback>
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
                                {user ? (
                                    <>
                                        <Link
                                            href='/api/auth/signout'
                                            className='flex items-center w-full space-x-2'>
                                            <LogOut />
                                            <span>Log out</span>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            href='/auth/login'
                                            className='flex items-center w-full space-x-2'>
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
        </div>
    );
};
