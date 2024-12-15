'use client';

import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Input,
    Label,
    ScrollArea,
    Separator,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
} from '@b-prism/shadcn-ui/index';
import { CreateWarehouseDto, UserDto } from '@dto';
import { useSession } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { useCreateWarehouse, useGetAddress } from 'apps/web-app/src/hooks/map.hook';

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

interface InputFieldProps {
    className?: string;
    name: string;
    control: any;
    label: string;
    type?: string;
    placeholder?: string;
    rules?: any;
}

const CreateWarehouseDialog: React.FC<DialogProps> = ({ isOpen, setIsOpen, marker, fetchAllWarehouses }) => {
    const { data: session } = useSession();
    const { createWarehouse } = useCreateWarehouse();
    const { getAddress, address } = useGetAddress();

    // After opening the dialog, get the address
    useEffect(() => {
        if (isOpen && marker.longitude && marker.latitude) {
            getAddress(marker.longitude, marker.latitude);
        }
    }, [isOpen, marker, getAddress]);

    // Initialize react-hook-form with default values
    const { handleSubmit, control, reset } = useForm<CreateWarehouseDto>({
        defaultValues: {
            type: 'warehouse',
            name: '',
            description: '',
            longitude: marker.longitude,
            latitude: marker.latitude,
            capacity: 0,
            cost_of_stockpile: 0,
            family_food_packs: 0,
            standby_funds: 0,
            non_food_items: {
                family_kits: 0,
                sleeping_kits: 0,
                hygiene_kits: 0,
                kitchen_kits: 0,
                other_nfis: 0,
            },
            address: {
                street: '',
                post_code: '',
                locality: '',
                place: '',
                region: '',
                country: '',
            },
            user_id: (session?.user as UserDto)?.id ?? '',
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    useEffect(() => {
        if (address) {
            reset((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    ...address,
                },
            }));
        }
    }, [address, reset]);

    // Reset form values when the marker updates
    useEffect(() => {
        reset((prevValues) => ({
            ...prevValues,
            longitude: marker.longitude,
            latitude: marker.latitude,
        }));
    }, [marker, reset]);

    // Form submission handler
    const onSubmit = async (data: CreateWarehouseDto) => {
        const formattedData = {
            ...data,
            capacity: Number(data.capacity),
            address: {
                ...address,
            },
        };

        console.log(formattedData);

        await createWarehouse(formattedData);
        fetchAllWarehouses();
        setIsOpen(false);
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent className='h-full max-h-[630px]'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Tabs
                        defaultValue='general'
                        className='flex flex-row gap-4'>
                        <TabsList className='flex flex-col h-fit w-full max-w-[150px]'>
                            <TabsTrigger
                                className='w-full'
                                value='general'>
                                General
                            </TabsTrigger>
                            <TabsTrigger
                                className='w-full'
                                value='inventory'>
                                Inventory
                            </TabsTrigger>
                            <TabsTrigger
                                className='w-full'
                                value='address'>
                                Address
                            </TabsTrigger>
                        </TabsList>

                        <div className='w-full'>
                            {/* General Information Tab */}
                            <TabsContent
                                value='general'
                                className='w-full'>
                                <div className='flex flex-col gap-4'>
                                    <DialogHeader>
                                        <DialogTitle>Warehouse Information</DialogTitle>
                                        <DialogDescription>
                                            Please enter the details of the warehouse.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <Separator orientation='horizontal' />

                                    <div>
                                        <InputField
                                            name='name'
                                            control={control}
                                            label='Name'
                                            placeholder='Warehouse Name'
                                            rules={{ required: 'Warehouse name is required' }}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor='description'>Description</Label>
                                        <Textarea
                                            id='description'
                                            className='rounded-sm mt-1'
                                            placeholder='Description'
                                        />
                                    </div>

                                    <div>
                                        <InputField
                                            name='capacity'
                                            control={control}
                                            label='Capacity'
                                            type='number'
                                            placeholder='Ex. 1000'
                                            rules={{ required: 'Warehouse capacity is required' }}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Inventory Tab */}
                            <TabsContent
                                value='inventory'
                                className='w-full'>
                                <div className='flex flex-col gap-4'>
                                    <DialogHeader>
                                        <DialogTitle>Warehouse Inventory</DialogTitle>
                                        <DialogDescription>
                                            Please enter the details of the warehouse inventory.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <Separator
                                        orientation='horizontal'
                                        className='my-3'
                                    />

                                    <ScrollArea className='flex flex-col h-[435px]'>
                                        <div className='flex flex-row gap-4 '>
                                            <InputField
                                                name='cost_of_stockpile'
                                                control={control}
                                                label='Cost of Stockpile'
                                                type='number'
                                                placeholder='Ex. 1000'
                                                rules={{ required: 'Warehouse cost of stockpile is required' }}
                                                className='w-1/2'
                                            />

                                            <InputField
                                                name='family_food_packs'
                                                control={control}
                                                label='Family Food Packs'
                                                type='number'
                                                placeholder='Ex. 1000'
                                                rules={{ required: 'Warehouse family food packs is required' }}
                                                className='w-1/2 '
                                            />
                                        </div>

                                        <div className='mt-3'>
                                            <InputField
                                                name='standby_funds'
                                                control={control}
                                                label='Standby Funds'
                                                type='number'
                                                placeholder='Ex. 1000'
                                                rules={{ required: 'Warehouse standby funds is required' }}
                                            />
                                        </div>

                                        <Separator
                                            orientation='horizontal'
                                            className='my-5'
                                        />

                                        <div>
                                            <Label>Non-Food Items</Label>
                                            {/* description */}
                                            <p className='text-sm text-gray-500'>
                                                Please enter the details of the warehouse non-food items.
                                            </p>

                                            <div className='flex mt-3 flex-row gap-4'>
                                                <InputField
                                                    name='non_food_items.family_kits'
                                                    control={control}
                                                    label='Family Kits'
                                                    type='number'
                                                    placeholder='Ex. 1000'
                                                    className='w-1/2'
                                                />

                                                <InputField
                                                    name='non_food_items.sleeping_kits'
                                                    control={control}
                                                    label='Sleeping Kits'
                                                    type='number'
                                                    placeholder='Ex. 1000'
                                                    className='w-1/2'
                                                />
                                            </div>

                                            <div className='flex mt-3 flex-row gap-4'>
                                                <InputField
                                                    name='non_food_items.hygiene_kits'
                                                    control={control}
                                                    label='Hygiene Kits'
                                                    type='number'
                                                    placeholder='Ex. 1000'
                                                    className='w-1/2'
                                                />

                                                <InputField
                                                    name='non_food_items.kitchen_kits'
                                                    control={control}
                                                    label='Kitchen Kits'
                                                    type='number'
                                                    placeholder='Ex. 1000'
                                                    className='w-1/2'
                                                />
                                            </div>

                                            <InputField
                                                name='non_food_items.other_nfis'
                                                control={control}
                                                label='Other Non-Food Items'
                                                type='number'
                                                placeholder='Ex. 1000'
                                                className='mt-2 mb-10'
                                            />
                                        </div>
                                    </ScrollArea>
                                </div>
                            </TabsContent>

                            {/* Address Tab */}
                            <TabsContent
                                value='address'
                                className='w-full flex flex-col gap-4'>
                                <div>
                                    <DialogHeader>
                                        <DialogTitle>Warehouse Address</DialogTitle>
                                        <DialogDescription>
                                            Auto-filled based on marker position. Edit if needed.
                                        </DialogDescription>
                                    </DialogHeader>
                                </div>

                                <Separator orientation='horizontal' />

                                <div className='flex flex-row gap-4'>
                                    <InputField
                                        name='address.street'
                                        control={control}
                                        label='Street'
                                        placeholder='Street'
                                        rules={{ required: 'Warehouse street is required' }}
                                        className='w-full'
                                    />
                                </div>

                                <div className='flex flex-row gap-4'>
                                    <InputField
                                        name='address.post_code'
                                        control={control}
                                        label='Post Code'
                                        placeholder='Post Code'
                                        rules={{ required: 'Warehouse post code is required' }}
                                        className='w-1/2'
                                    />

                                    <InputField
                                        name='address.locality'
                                        control={control}
                                        label='Locality'
                                        placeholder='Locality'
                                        rules={{ required: 'Warehouse locality is required' }}
                                        className='w-1/2'
                                    />
                                </div>

                                <div className='flex flex-row gap-4'>
                                    <InputField
                                        name='address.place'
                                        control={control}
                                        label='Place'
                                        placeholder='Place'
                                        rules={{ required: 'Warehouse place is required' }}
                                        className='w-full'
                                    />
                                </div>

                                <div className='flex flex-row gap-4'>
                                    <InputField
                                        name='address.region'
                                        control={control}
                                        label='Region'
                                        placeholder='Region'
                                        rules={{ required: 'Warehouse region is required' }}
                                        className='w-1/2'
                                    />

                                    <InputField
                                        name='address.country'
                                        control={control}
                                        label='Country'
                                        placeholder='Country'
                                        rules={{ required: 'Warehouse country is required' }}
                                        className='w-1/2'
                                    />
                                </div>
                            </TabsContent>

                            {/* Submit Button */}
                            <Button
                                type='submit'
                                className='bg-blue-500 absolute bottom-4 w-full max-w-[580px] hover:bg-blue-600 text-white px-4'>
                                Submit
                            </Button>
                        </div>
                    </Tabs>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const InputField: React.FC<InputFieldProps> = ({
    className,
    name,
    control,
    label,
    type = 'text',
    placeholder,
    rules,
}) => (
    <div className={`${className}`}>
        <Label
            className=' font-normal'
            htmlFor={name}>
            {label}
        </Label>
        <Controller
            name={name}
            control={control}
            rules={rules}
            render={({ field, fieldState }) => (
                <>
                    <Input
                        {...field}
                        type={type}
                        placeholder={placeholder}
                        className={`rounded-sm mt-1`}
                    />
                    {fieldState.error && <small className='text-red-400'>{fieldState.error.message}</small>}
                </>
            )}
        />
    </div>
);

export default CreateWarehouseDialog;
