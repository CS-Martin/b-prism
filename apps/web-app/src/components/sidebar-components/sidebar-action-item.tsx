import { SidebarMenuButton, SidebarMenuItem, Switch } from '@b-prism/shadcn-ui/index';
import { UserDto } from '@dto';
import { LucideIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useMapActionStore } from '../../stores/sidebar-map-action.store';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';

interface SidebarActionItemProps {
    id: string;
    label: string;
    icon: LucideIcon;
    toastTitle: string;
    toastDescription: string;
}

export const SidebarActionItem = ({ id, label, icon: Icon, toastTitle, toastDescription }: SidebarActionItemProps) => {
    const { data: session } = useSession();
    const { toast } = useToast();
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
            <SidebarMenuButton className='flex justify-between hover:bg-transparent'>
                <Icon style={{ height: '18px', width: '18px' }} />
                <span className='flex-1'>{label}</span>

                <Switch
                    id={id}
                    checked={selectedAction === id}
                    onCheckedChange={handleCheckedChange}
                    className='data-[state=checked]:bg-blue-500 '
                />
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};
