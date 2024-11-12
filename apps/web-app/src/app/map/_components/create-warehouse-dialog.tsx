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
import { CreateWarehouseDto, UserDto, WarehouseCapacityDto, WarehouseItemDto, WarehouseThresholdDto } from '@dto';
import { useSession } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { useCreateWarehouse } from 'apps/web-app/src/hooks/map.hook';

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
    const { data: session } = useSession();
    const { createWarehouse } = useCreateWarehouse();

    // Initialize react-hook-form with default values
    const { handleSubmit, control, reset } = useForm<CreateWarehouseDto>({
        defaultValues: {
            type: 'warehouse',
            name: '',
            longitude: marker.longitude,
            latitude: marker.latitude,
            capacity: {
                current_stock: 0,
                max_stock: 0,
                last_updated: new Date(),
            } as WarehouseCapacityDto,
            items: [{ warehouseThreshold: {} as WarehouseThresholdDto }] as WarehouseItemDto[],
            userId: (session?.user as UserDto)?.id ?? '',
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    // Reset form values when the marker updates
    useEffect(() => {
        reset({
            longitude: marker.longitude,
            latitude: marker.latitude,
        });
    }, [marker, reset]);

    // Form submission handler
    const onSubmit = async (data: CreateWarehouseDto) => {
        // Convert string values to numbers for capacity and warehouseThreshold
        const formattedData = {
            ...data,
            capacity: {
                current_stock: Number(data.capacity.current_stock),
                max_stock: Number(data.capacity.max_stock),
            },
            items: data.items?.map((item) => ({
                ...item,
                quantity: Number(item.quantity),
                unit_price: Number(item.unit_price),
                warehouseThreshold: {
                    ...item.warehouseThreshold,
                    min: Number(item.warehouseThreshold.min),
                    max: Number(item.warehouseThreshold.max),
                },
            })),
        };

        await createWarehouse(formattedData);
        fetchAllWarehouses();
        setIsOpen(false);
    };

    return (
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
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='grid gap-4'
                >
                    <div>
                        <Label htmlFor='name'>Name</Label>
                        <Controller
                            name='name'
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder='Warehouse Name'
                                    className='rounded-sm mt-1'
                                />
                            )}
                        />
                    </div>

                    <div className='flex flex-row gap-4 justify-between'>
                        <div className='w-1/2'>
                            <Label htmlFor='capacity.current_stock'>Current Stock</Label>
                            <Controller
                                name='capacity.current_stock'
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type='number'
                                        placeholder='Ex. 1000'
                                        className='rounded-sm mt-1'
                                    />
                                )}
                            />
                        </div>
                        <div className='w-1/2'>
                            <Label htmlFor='capacity.max_stock'>Max Stock</Label>
                            <Controller
                                name='capacity.max_stock'
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type='number'
                                        placeholder='Ex. 1000'
                                        className='rounded-sm mt-1'
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <Label htmlFor='items'>Items</Label>
                        <div>
                            <Label>Name</Label>
                            <Controller
                                name={`items.${0}.name`}
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder='Item Name'
                                        className='rounded-sm mt-1'
                                    />
                                )}
                            />
                        </div>
                        <div className='flex flex-row gap-4'>
                            <div className='w-1/2'>
                                <Label>Quantity</Label>
                                <Controller
                                    name={`items.${0}.quantity`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type='number'
                                            placeholder='Ex. 1000'
                                            className='rounded-sm mt-1'
                                        />
                                    )}
                                />
                            </div>
                            <div className='w-1/2'>
                                <Label>Unit Price</Label>
                                <Controller
                                    name={`items.${0}.unit_price`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type='number'
                                            placeholder='Ex. 1000'
                                            className='rounded-sm mt-1'
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className='flex flex-row gap-4'>
                            <p>Warehouse Threshold</p>
                            <div className='w-1/2'>
                                <Label>Minimum Quantity</Label>
                                <Controller
                                    name={`items.${0}.warehouseThreshold.min`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type='number'
                                            placeholder='Ex. 1000'
                                            className='rounded-sm mt-1'
                                        />
                                    )}
                                />
                            </div>
                            <div className='w-1/2'>
                                <Label>Maximum Quantity</Label>
                                <Controller
                                    name={`items.${0}.warehouseThreshold.max`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type='number'
                                            placeholder='Ex. 1000'
                                            className='rounded-sm mt-1'
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <button type='submit'>Submit</button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateWarehouseDialog;
