import { SidebarMenuButton, SidebarMenuItem, Switch } from '@b-prism/shadcn-ui/index';
import { UserDto } from '@dto';
import { LucideIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMapActionStore } from '../../stores/sidebar-map-action.store';
import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';

interface SidebarActionItemProps {
    id: string;
    label: string;
    icon: LucideIcon;
    toastTitle: string;
    toastDescription: string;
}

export const SidebarActionItem = ({ id, label, icon: Icon, toastTitle, toastDescription }: SidebarActionItemProps) => {
    const { data: session } = useSession();
    const { selectedAction, setSelectedAction } = useMapActionStore();
    const user = (session?.user ?? {}) as Partial<UserDto>;

    if (user.role !== 'admin' && user.role !== 'verified') {
        return null;
    }

    const handleCheckedChange = () => {
        setSelectedAction(selectedAction === id ? null : id);
        toast({
            title: toastTitle,
            description: toastDescription,
        });
    };

    return (
        <SidebarMenuItem>
            <div className='peer/menu-button w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:text-sidebar-accent-foreground h-8 text-sm flex justify-between hover:bg-transparent'>
                <Icon style={{ height: '18px', width: '18px' }} />
                <span className='flex-1'>{label}</span>

                <Switch
                    id={id}
                    checked={selectedAction === id}
                    onCheckedChange={handleCheckedChange}
                    className='data-[state=checked]:bg-blue-500 '
                />
            </div>
        </SidebarMenuItem>
    );
};
