import { Label, Switch } from '@b-prism/shadcn-ui/index';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';

export const ADMIN_PERMISSIONS = [
    {
        category: 'Admin Permissions',
        permissions: [
            {
                id: 'ACTIVITY_LOG_PERMISSION',
                label: 'Access to activity logs',
                description: 'This allows you to monitor the system',
                value: false,
            },
            {
                id: 'ACCOUNT_CREATION',
                label: 'Account Creation',
                description: 'Allows creating user accounts and managing their roles',
                value: false,
            },
            {
                id: 'ROLE_PERMISSION',
                label: 'Role Change',
                description: 'Allows assigning roles and managing user privileges',
                value: false,
            },
            {
                id: 'USER_PERMISSION',
                label: 'User Management',
                description: 'Allows updating user information and managing user accounts',
                value: false,
            },
        ],
    },
];

export const MAP_PERMISSIONS = [
    {
        category: 'Map Permissions',
        permissions: [
            {
                id: 'WAREHOUSE_PERMISSION',
                label: 'Warehouse Actions',
                description: 'Allows creating, updating, and deleting warehouses',
                value: false,
            },
            {
                id: 'DISPENSING_POINT_PERMISSION',
                label: 'Dispensing Point Actions',
                description: 'Allows creating, updating, and deleting dispensing points',
                value: false,
            },
            {
                id: 'ROAD_NETWORK_PERMISSION',
                label: 'Road Network Actions',
                description: 'Allows modifying the road network, including damage and repair actions',
                value: false,
            },
            {
                id: 'RESCUE_POST_PERMISSION',
                label: 'Rescue Post Actions',
                description: 'Allows creating and managing rescue posts on the map',
                value: false,
            },
        ],
    },
];

export const RolePermissionsForm = ({ readOnly = false }) => {
    const { setValue, watch } = useFormContext();
    const adminPermissions = watch('adminPermissions') || {};
    const mapPermissions = watch('mapPermissions') || {};

    const handlePermissionChange = (category: string, id: string, value: boolean) => {
        const updatedPermissions = { ...watch(category), [id]: value };
        setValue(category, updatedPermissions);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}>
            <ScrollArea>
                <form className='flex flex-col gap-5'>
                    <div className='p-5 border rounded-lg'>
                        <div className='flex flex-col gap-5'>
                            <Label className='font-semibold'>Administrator Permissions</Label>
                            <div className='grid gap-6 md:grid-cols-2'>
                                {ADMIN_PERMISSIONS[0].permissions.map((p) => {
                                    return (
                                        <div
                                            className='flex flex-row-reverse items-center gap-5 border-b md:flex-row md:p-3 md:items-center'
                                            key={p.label}>
                                            <Switch
                                                checked={adminPermissions[p.id] || false}
                                                onCheckedChange={(checked) => !readOnly && handlePermissionChange('adminPermissions', p.id, checked)}
                                                disabled={readOnly}
                                                className='data-[state=checked]:bg-blue-500'
                                            />
                                            <div className='flex flex-col mb-3 mr-auto'>
                                                <p className='font-bold'>{p.label}</p>
                                                <small className='text-[12px]'>{p.description}</small>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className='p-5 border rounded-lg'>
                        <div className='flex flex-col gap-5'>
                            <Label className='font-semibold'>Map Permissions</Label>
                            <div className='grid gap-6 md:grid-cols-2'>
                                {MAP_PERMISSIONS[0].permissions.map((p) => {
                                    return (
                                        <div
                                            className='flex flex-row-reverse items-center gap-5 border-b md:flex-row md:p-3 md:items-center'
                                            key={p.label}>
                                            <Switch
                                                checked={mapPermissions[p.id] || false}
                                                onCheckedChange={(checked) => !readOnly && handlePermissionChange('mapPermissions', p.id, checked)}
                                                disabled={readOnly}
                                                className='data-[state=checked]:bg-blue-500'
                                            />
                                            <div className='flex flex-col mb-3 mr-auto'>
                                                <p className='font-bold'>{p.label}</p>
                                                <small className='text-[12px]'>{p.description}</small>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </form>
            </ScrollArea>
        </motion.div>
    );
};
