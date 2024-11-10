'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Input,
    Label,
    Textarea,
} from '@b-prism/shadcn-ui/index';
import { CreateWarehouseDto } from '@dto';
import { useCreateWarehouse } from 'apps/web-app/src/hooks/map.hook';
import { useState, useEffect } from 'react';

interface MarkerType {
    longitude: string;
    latitude: string;
}

interface DialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    marker: MarkerType;
    fetchAllWarehouses: () => void;
}

const CreateWarehouseDialog: React.FC<DialogProps> = ({ isOpen, setIsOpen, marker, fetchAllWarehouses }) => {
    const [warehouseData, setWarehouseData] = useState<CreateWarehouseDto>({
        type: 'warehouse',
        name: '',
        description: '',
        longitude: marker.longitude,
        latitude: marker.latitude,
        capacity: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    useEffect(() => {
        setWarehouseData({ ...warehouseData, longitude: marker.longitude, latitude: marker.latitude });
    }, [marker]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setWarehouseData({ ...warehouseData, [name]: value });
    };

    const { createWarehouse } = useCreateWarehouse(warehouseData);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await createWarehouse();

        fetchAllWarehouses();

        setIsOpen(false);
    };

    return (
        <>
            <Dialog
                open={isOpen}
                onOpenChange={setIsOpen}
            >
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Warehouse Information</DialogTitle>
                        <DialogDescription>Please enter the details of the warehouse.</DialogDescription>
                    </DialogHeader>
                    <div className='grid gap-4'>
                        <form
                            method='POST'
                            onSubmit={handleSubmit}
                        >
                            <div>
                                <Label className='mb-5'>Name</Label>
                                <Input
                                    id='name'
                                    name='name'
                                    className='rounded-sm mt-1'
                                    onChange={handleInputChange}
                                    placeholder='Warehouse Name'
                                />
                            </div>

                            <div>
                                <Label className=''>Description</Label>
                                <Textarea
                                    id='description'
                                    name='description'
                                    className='rounded-sm mt-1'
                                    onChange={handleInputChange}
                                    placeholder='Description'
                                />
                            </div>

                            <div className='items-center'>
                                <Label className=''>Capacity</Label>
                                <Input
                                    id='capacity'
                                    name='capacity'
                                    type='number'
                                    className='rounded-sm mt-1'
                                    onChange={handleInputChange}
                                    placeholder='Ex. 1000'
                                />
                            </div>
                            <button type='submit'>Submit</button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateWarehouseDialog;
