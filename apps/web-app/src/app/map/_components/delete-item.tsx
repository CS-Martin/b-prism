'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@b-prism/shadcn-ui/components/ui/alert-dialog';
import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { useDeleteDispensingPoint } from 'apps/web-app/src/hooks/dispensing-point.hook';
import { useDeleteWarehouse } from 'apps/web-app/src/hooks/map.hook';
import { useDispensingPointsStore } from 'apps/web-app/src/stores/map-stores/dispensing-point.store';
import { useWarehouseStore } from 'apps/web-app/src/stores/map-stores/warehouse.store';
import { Session } from 'next-auth';

interface DeleteItemProps {
    item: { type: string; id: string };
    onCancel: () => void;
    session?: Session | null;
}

/**
 * DeleteItem component
 *
 * @param {DeleteItemProps} props - The properties for the component.
 * @param {Object} props.item - The item to be deleted.
 * @param {string} props.item.type - The type of the item (e.g., 'warehouse', 'dispensing_point').
 * @param {string} props.item.id - The ID of the item.
 * @param {Function} props.onCancel - The function to call when the cancel button is clicked.
 * @param {Function} props.fetchAllWarehouses - The function to call to re-fetch all warehouses.
 * @param {Function} props.fetchAllDispensingPoints - The function to call to re-fetch all dispensing points.
 *
 * @returns {JSX.Element} The rendered component.
 */
const DeleteItem = ({ item, onCancel, session }: DeleteItemProps) => {
    const { deleteWarehouse } = useDeleteWarehouse();
    const { deleteDispensingPoint } = useDeleteDispensingPoint();

    const user = session?.user;

    if (!user) return;

    const userFullname = `${user?.given_name} ${user?.family_name}`;

    /**
     * Handles the delete action based on the item type.
     */
    const handleDelete = async () => {
        switch (item.type) {
            case 'warehouse':
                if (user.permissions.includes('WAREHOUSE_PERMISSION')) {
                    await deleteWarehouse(item.id, userFullname, user.access_token);
                    useWarehouseStore.getState().removeWarehouse(item.id);
                } else {
                    toast({
                        title: 'Unauthorized',
                        description: 'You do not have permission to delete warehouses.',
                        variant: 'destructive',
                    });
                }
                break;
            case 'dispensing_point':
                if (user.permissions.includes('DISPENSING_POINT_PERMISSION')) {
                    await deleteDispensingPoint(item.id, userFullname, user.access_token);
                    useDispensingPointsStore.getState().removeDispensingPoint(item.id);
                } else {
                    toast({
                        title: 'Unauthorized',
                        description: 'You do not have permission to delete dispensing points.',
                        variant: 'destructive',
                    });
                }
                break;
            default:
                break;
        }
    };

    return (
        <AlertDialog
            open={true}
            onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the selected {item.type === 'warehouse' ? 'Warehouse' : 'Dispensing Point'}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className='bg-red-500'>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteItem;
