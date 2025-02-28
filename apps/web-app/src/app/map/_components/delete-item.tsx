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
import { UserDto } from '@dto';
import { useDeleteDispensingPoint, useDeleteWarehouse } from 'apps/web-app/src/hooks/map.hook';
import { useSession } from 'next-auth/react';

interface DeleteItemProps {
    item: { type: string; id: string };
    onCancel: () => void;
    fetchAllWarehouses: () => void;
    fetchAllDispensingPoints: () => void;
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
const DeleteItem = ({ item, onCancel, fetchAllWarehouses, fetchAllDispensingPoints }: DeleteItemProps) => {
    const { data: session } = useSession();
    const { deleteWarehouse } = useDeleteWarehouse();
    const { deleteDispensingPoint } = useDeleteDispensingPoint();

    const user = session?.user;
    const userFullname = `${user?.given_name} ${user?.family_name}`;

    /**
     * Handles the delete action based on the item type.
     */
    const handleDelete = async () => {
        switch (item.type) {
            case 'warehouse':
                await deleteWarehouse(item.id, userFullname);
                break;
            case 'dispensing_point':
                await deleteDispensingPoint(item.id, userFullname);
                break;
            // To add: Evacuation point
            default:
                break;
        }

        // Trigger re-fetch of warehouses to update client
        fetchAllWarehouses();
        fetchAllDispensingPoints();
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
