import { Label, Switch } from '@b-prism/shadcn-ui/index';
import { ScrollArea } from '@radix-ui/react-scroll-area';

export const ADMIN_PERMISSIONS = [
    {
        category: 'Admin Permissions',
        permissions: [
            {
                label: 'Access to activity logs',
                description: 'This allows you to monitor the system',
                value: false,
            },
            {
                label: 'Account Creation',
                description: 'Allows creating user accounts and managing their roles',
                value: false,
            },
            {
                label: 'Role Change',
                description: 'Allows assigning roles and managing user privileges',
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
                label: 'Warehouse Action',
                description: 'Allows creating, updating, and deleting warehouses',
                value: false,
            },
            {
                label: 'Dispensing Point Action',
                description: 'Allows creating, updating, and deleting dispensing points',
                value: false,
            },
            {
                label: 'Road Network Action',
                description: 'Allows modifying the road network, including damage and repair actions',
                value: false,
            },
            {
                label: 'Rescue Post Management',
                description: 'Allows creating and managing rescue posts on the map',
                value: false,
            },
        ],
    },
];

export const RolePermissionsForm = () => {
    return (
        <ScrollArea>
            <form className='flex flex-col gap-5'>
                <div className='p-5 border rounded-lg'>
                    <div className='flex flex-col gap-5'>
                        <Label className='font-semibold'>Administrator Permissions</Label>
                        <div className='grid grid-cols-2 gap-6'>
                            {ADMIN_PERMISSIONS[0].permissions.map((p) => {
                                return (
                                    <div
                                        className='flex flex-row items-center gap-5 p-3 border-b'
                                        key={p.label}>
                                        <Switch />
                                        <div className='flex flex-col'>
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
                        <div className='grid grid-cols-2 gap-6'>
                            {MAP_PERMISSIONS[0].permissions.map((p) => {
                                return (
                                    <div
                                        className='flex flex-row items-center gap-5 p-3 border-b'
                                        key={p.label}>
                                        <Switch />
                                        <div className='flex flex-col'>
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
                        <div className='grid grid-cols-2 gap-6'>
                            {MAP_PERMISSIONS[0].permissions.map((p) => {
                                return (
                                    <div
                                        className='flex flex-row items-center gap-5 p-3 border-b'
                                        key={p.label}>
                                        <Switch />
                                        <div className='flex flex-col'>
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
    );
};
