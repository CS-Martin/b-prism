import { SidebarMenuButton, SidebarMenuItem } from '@b-prism/shadcn-ui/index';
import { LucideIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';

interface SidebarLinkItemProps {
    label: string;
    icon: LucideIcon;
    href: string;
}

export const SidebarLinkItem = ({ label, icon: Icon, href }: SidebarLinkItemProps) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                size='default'
                className='data-[active=true]:bg-blue-500 data-[active=true]:hover:bg-blue-600 data-[active=true]:text-white'
                isActive={isActive}>
                <a
                    href={href}
                    className='flex items-center'>
                    <Icon style={{ height: '18px', width: '18px' }} />
                    <span>{label}</span>
                </a>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};
