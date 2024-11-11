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
import { useDeleteDispensingPoint, useDeleteWarehouse } from 'apps/web-app/src/hooks/map.hook';

interface DeleteItemProps {
    item: { type: string; id: string };
    onCancel: () => void;
    fetchAllWarehouses: () => void;
    fetchAllDispensingPoints: () => void;
}

const DeleteItem = ({ item, onCancel, fetchAllWarehouses, fetchAllDispensingPoints }: DeleteItemProps) => {
    const { deleteWarehouse } = useDeleteWarehouse(item.id);
    const { deleteDispensingPoint } = useDeleteDispensingPoint(item.id);
    const handleDelete = async () => {
        switch (item.type) {
            case 'warehouse':
                await deleteWarehouse();
                break;
            case 'dispensing-point':
                await deleteDispensingPoint();
                break;
            // To add: Evacuation point
            default:
                break;
        }

        // Trigger re-fetch of warehouses
        fetchAllWarehouses();
        fetchAllDispensingPoints();
    };

    return (
        <AlertDialog
            open={true}
            onOpenChange={onCancel}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the selected warehouse.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        className='bg-red-500'
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteItem;
