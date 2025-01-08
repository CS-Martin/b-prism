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

const DeleteItem = ({ item, onCancel, fetchAllWarehouses, fetchAllDispensingPoints }: DeleteItemProps) => {
    const { data: session } = useSession();
    const { deleteWarehouse } = useDeleteWarehouse(item.id);
    const { deleteDispensingPoint } = useDeleteDispensingPoint();

    const user: UserDto = session?.user as UserDto;

    const handleDelete = async () => {
        switch (item.type) {
            case 'warehouse':
                await deleteWarehouse();
                break;
            case 'dispensing_point':
                await deleteDispensingPoint(item.id, `${user.given_name} ${user.family_name}`);
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
            onOpenChange={onCancel}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. This will permanently delete the selected warehouse.</AlertDialogDescription>
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
