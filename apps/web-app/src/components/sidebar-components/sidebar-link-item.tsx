import { SidebarMenuButton, SidebarMenuItem } from '@b-prism/shadcn-ui/index';
import { LucideIcon } from 'lucide-react';

interface SidebarLinkItemProps {
    label: string;
    icon: LucideIcon;
    href: string;
}

export const SidebarLinkItem = ({ label, icon: Icon, href }: SidebarLinkItemProps) => {
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
};
