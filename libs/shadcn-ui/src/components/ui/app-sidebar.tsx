'use client';

import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import {
    Button,
    Label,
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
    Toast,
    ToastAction,
} from '@b-prism/shadcn-ui/index';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@b-prism/shadcn-ui/components/ui/alert-dialog';

interface AppSidebarProps {
    setSelectedAction: (action: string | null) => void;
}

export function AppSidebar({ setSelectedAction }: AppSidebarProps) {
    const { toast } = useToast();
    const [selectedAction, setInternalSelectedAction] = useState<string | null>(null);

    const handleToggle = (action: string) => {
        const newAction = selectedAction === action ? null : action;
        setInternalSelectedAction(newAction);
        setSelectedAction(newAction);

        if (newAction) {
            switch (newAction) {
                case 'createWarehouse':
                    toast({
                        title: 'Create Warehouse',
                        description: `Please click on the map to create a warehouse`,
                    });
                    break;
                case 'createDispensingPoint':
                    toast({
                        title: 'Create Dispensing Point',
                        description: `Please click on the map to create a dispensing point`,
                    });
                    break;
                case 'deleteItem':
                    toast({
                        title: 'Delete an Item',
                        description: `Please click on the item you want to delete`,
                    });
                    break;
                default:
                    break;
            }
        }
    };

    return (
        <Sidebar>
            <SidebarHeader>HEADER</SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className='p-0'>Actions</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className='gap-5'>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant='outline'>Show Dialog</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your account and
                                            remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <SidebarMenuItem onClick={() => handleToggle('createWarehouse')}>
                                <div className='flex justify-between items-center space-x-2'>
                                    <Label>Create Warehouse</Label>
                                    <Switch
                                        id='create-warehouse'
                                        checked={selectedAction === 'createWarehouse'}
                                        onChange={() => handleToggle('createWarehouse')}
                                    />
                                </div>
                            </SidebarMenuItem>
                            <SidebarMenuItem onClick={() => handleToggle('createDispensingPoint')}>
                                <div className='flex justify-between items-center space-x-2'>
                                    <Label>Create Dispensing Point</Label>
                                    <Switch
                                        id='create-dispensing-point'
                                        checked={selectedAction === 'createDispensingPoint'}
                                        onChange={() => handleToggle('createDispensingPoint')}
                                    />
                                </div>
                            </SidebarMenuItem>
                            <SidebarMenuItem onClick={() => handleToggle('deleteItem')}>
                                <div className='flex justify-between items-center space-x-2'>
                                    <Label>Delete Item</Label>
                                    <Switch
                                        id='delete-item'
                                        checked={selectedAction === 'deleteItem'}
                                        onChange={() => handleToggle('deleteItem')}
                                    />
                                </div>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <ModeToggle />
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>FOOTER</SidebarFooter>
        </Sidebar>
    );
}
