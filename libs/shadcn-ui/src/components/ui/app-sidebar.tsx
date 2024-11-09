'use client';

import {
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
} from '@b-prism/shadcn-ui/index';
import { useState } from 'react';

interface AppSidebarProps {
    setSelectedAction: (action: string | null) => void;
}

export function AppSidebar({ setSelectedAction }: AppSidebarProps) {
    const [selectedAction, setInternalSelectedAction] = useState<string | null>(null);

    const handleToggle = (action: string) => {
        const newAction = selectedAction === action ? null : action;
        setInternalSelectedAction(newAction);
        setSelectedAction(newAction);
    };

    return (
        <Sidebar>
            <SidebarHeader>HEADER</SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className='p-0'>Actions</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className='gap-5'>
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
