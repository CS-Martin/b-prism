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
import { DispensingPointDto, WarehouseDto } from '@dto';

interface DeleteItemProps {
    item: { type: string; id: string };
    onCancel: () => void;
}

const DeleteItem = ({ onCancel }: DeleteItemProps) => {
    const handleDelete = () => {
        console.log('Deleting');
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
                    <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteItem;
