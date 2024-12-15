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
import { CreateWarehouseDto, UpdateWarehouseDto, UserDto } from '@dto';
import { useSession } from 'next-auth/react';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import {
    useCreateWarehouse,
    useFindOneWarehouse,
    useGetAddress,
    useUpdateWarehouse,
} from 'apps/web-app/src/hooks/map.hook';
import InputField from 'apps/web-app/src/components/forms/input-field';

interface DialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    warehouseId: string;
}

const CreateWarehouseDialog: React.FC<DialogProps> = ({ isOpen, setIsOpen, warehouseId }) => {
    const { data: session } = useSession();
    const { updateWarehouse } = useUpdateWarehouse();
    const { warehouse } = useFindOneWarehouse(warehouseId);

    // Initialize react-hook-form with default values
    const { handleSubmit, control, reset } = useForm<UpdateWarehouseDto>({
        defaultValues: {
            type: 'warehouse',
            name: warehouse.name,
            description: warehouse.description,
            longitude: warehouse.longitude,
            latitude: warehouse.latitude,
            capacity: warehouse.capacity,
            cost_of_stockpile: warehouse.cost_of_stockpile,
            family_food_packs: warehouse.family_food_packs,
            standby_funds: warehouse.standby_funds,
            non_food_items: {
                family_kits: warehouse?.non_food_items?.family_kits,
                sleeping_kits: warehouse?.non_food_items?.sleeping_kits,
                hygiene_kits: warehouse?.non_food_items?.hygiene_kits,
                kitchen_kits: warehouse?.non_food_items?.kitchen_kits,
                other_nfis: warehouse?.non_food_items?.other_nfis,
            },
            address: {
                street: warehouse?.address?.street,
                post_code: warehouse?.address?.post_code,
                locality: warehouse?.address?.locality,
                place: warehouse?.address?.place,
                region: warehouse?.address?.region,
                country: warehouse?.address?.country,
            },
            user_id: (session?.user as UserDto)?.id ?? '',
            created_at: new Date(),
            updated_at: new Date(),
        },
    });

    useEffect(() => {
        if (warehouse) {
            const { id, ...warehouseWithoutId } = warehouse;
            reset(warehouseWithoutId);
        }
    }, [warehouse, reset]);

    // Form submission handler
    const onSubmit = async (data: UpdateWarehouseDto) => {
        const formattedData = {
            ...data,
            capacity: Number(data.capacity),
        };

        console.log(formattedData);

        await updateWarehouse(warehouseId, formattedData);
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

export default CreateWarehouseDialog;
