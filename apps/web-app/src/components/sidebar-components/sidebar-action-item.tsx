import { SidebarMenuButton, SidebarMenuItem, Switch } from '@b-prism/shadcn-ui/index';
import { UserDto } from '@dto';
import { LucideIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface SidebarActionItemProps {
    id: string;
    label: string;
    icon: LucideIcon;
    selectedAction: string | null;
    handleToggle: (action: string) => void;
}

export const SidebarActionItem = ({ id, label, icon: Icon, selectedAction, handleToggle }: SidebarActionItemProps) => {
    const { data: session } = useSession();
    const user = (session?.user ?? {}) as Partial<UserDto>;

    if (user.role !== 'admin' && user.role !== 'verified') {
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
                    className='data-[state=checked]:bg-blue-500 '
                />
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
};
