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
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useCreateWarehouse, useGetAddress } from 'apps/web-app/src/hooks/map.hook';
import InputField from 'apps/web-app/src/components/forms/input-field';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';

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
    const { toast } = useToast();
    const { data: session } = useSession();
    const { createWarehouse } = useCreateWarehouse();
    const { getAddress, address } = useGetAddress();

    // Initialize react-hook-form with default values
    const {
        handleSubmit,
        reset,
        register,
        formState: { errors },
    } = useForm<CreateWarehouseDto>({
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

        // Avoid submitting the form when there are errors
    });

    // After opening the dialog, get the address
    useEffect(() => {
        if (isOpen && marker.longitude && marker.latitude) {
            getAddress(marker.longitude, marker.latitude);
        }
    }, [isOpen, marker]);

    useEffect(() => {
        if (address) {
            reset((prev) => ({
                ...prev,
                address,
            }));
        }
    }, [address, reset]);

    // Reset form values when the marker updates
    useEffect(() => {
        reset({ longitude: marker.longitude, latitude: marker.latitude });
    }, [marker, reset]);

    // Form submission handler
    const onSubmit = async (data: CreateWarehouseDto) => {
        try {
            const formattedData = {
                ...data,
                longitude: marker.longitude,
                latitude: marker.latitude,
            };

            if (!formattedData.longitude || !formattedData.latitude || !formattedData.name) {
                throw new Error('Warehouse name is required');
            }

            await createWarehouse(formattedData);
            fetchAllWarehouses();
            setIsOpen(false);
            reset();
        } catch (error) {
            console.error('Error creating warehouse:', error);
            toast({
                title: 'Error',
                description: (error as Error).message,
                variant: 'destructive',
            });
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent className='h-full max-h-[490px]'>
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
                                        <DialogDescription>Please enter the details of the warehouse.</DialogDescription>
                                    </DialogHeader>

                                    <Separator orientation='horizontal' />

                                    <div>
                                        <InputField
                                            name='name'
                                            register={register}
                                            label='Warehouse Name'
                                            type='text'
                                            placeholder='Warehouse Name'
                                            errors={errors.name}
                                            rules={{ required: 'Warehouse Name is required' }}
                                            className='w-full'
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor='description'>Description</Label>
                                        <Textarea
                                            {...register('description')}
                                            placeholder='Description'
                                            className='w-full'
                                        />
                                    </div>

                                    <div>
                                        <InputField
                                            name='capacity'
                                            register={register}
                                            label='Capacity'
                                            type='number'
                                            placeholder='Ex. 1000'
                                            className='w-full'
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
                                        <DialogDescription>Please enter the details of the warehouse inventory.</DialogDescription>
                                    </DialogHeader>

                                    <Separator
                                        orientation='horizontal'
                                        className='my-3'
                                    />

                                    <ScrollArea className='flex flex-col h-[270px]'>
                                        <div className='flex flex-row gap-4 '>
                                            <InputField
                                                name='cost_of_stockpile'
                                                register={register}
                                                label='Cost of Stockpile'
                                                type='number'
                                                placeholder='Ex. 1000'
                                                className='w-1/2'
                                            />

                                            <InputField
                                                name='family_food_packs'
                                                register={register}
                                                label='Family Food Packs'
                                                type='number'
                                                placeholder='Ex. 1000'
                                                className='w-1/2 '
                                            />
                                        </div>

                                        <div className='mt-3'>
                                            <InputField
                                                name='standby_funds'
                                                register={register}
                                                label='Standby Funds'
                                                type='number'
                                                placeholder='Ex. 1000'
                                                className='w-1/2 '
                                            />
                                        </div>

                                        <Separator
                                            orientation='horizontal'
                                            className='my-5'
                                        />

                                        <div>
                                            <Label>Non-Food Items</Label>
                                            {/* description */}
                                            <p className='text-sm text-gray-500'>Please enter the details of the warehouse non-food items.</p>

                                            <div className='flex mt-3 flex-row gap-4'>
                                                <InputField
                                                    name='non_food_items.family_kits'
                                                    register={register}
                                                    label='Family Kits'
                                                    type='number'
                                                    placeholder='Ex. 1000'
                                                    className='w-1/2'
                                                />

                                                <InputField
                                                    name='non_food_items.sleeping_kits'
                                                    register={register}
                                                    label='Sleeping Kits'
                                                    type='number'
                                                    placeholder='Ex. 1000'
                                                    className='w-1/2'
                                                />
                                            </div>

                                            <div className='flex mt-3 flex-row gap-4'>
                                                <InputField
                                                    name='non_food_items.hygiene_kits'
                                                    register={register}
                                                    label='Hygiene Kits'
                                                    type='number'
                                                    placeholder='Ex. 1000'
                                                    className='w-1/2'
                                                />

                                                <InputField
                                                    name='non_food_items.kitchen_kits'
                                                    register={register}
                                                    label='Kitchen Kits'
                                                    type='number'
                                                    placeholder='Ex. 1000'
                                                    className='w-1/2'
                                                />
                                            </div>

                                            <InputField
                                                name='non_food_items.other_nfis'
                                                register={register}
                                                label='Other NFI'
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
                                        <DialogDescription>Auto-filled based on marker position. Edit if needed.</DialogDescription>
                                    </DialogHeader>
                                </div>

                                <Separator orientation='horizontal' />

                                <div className='flex flex-row gap-4'>
                                    <InputField
                                        name='address.street'
                                        register={register}
                                        label='Street'
                                        type='text'
                                        placeholder='Street'
                                        className='w-full'
                                    />
                                </div>

                                <div className='flex flex-row gap-4'>
                                    <InputField
                                        name='address.post_code'
                                        register={register}
                                        label='Post Code'
                                        type='text'
                                        placeholder='Post Code'
                                        className='w-1/2'
                                    />

                                    <InputField
                                        name='address.locality'
                                        register={register}
                                        label='Locality'
                                        type='text'
                                        placeholder='Locality'
                                        className='w-1/2'
                                    />
                                </div>

                                <div className='flex flex-row gap-4'>
                                    <InputField
                                        name='address.place'
                                        register={register}
                                        label='Place'
                                        type='text'
                                        placeholder='Place'
                                        className='w-full'
                                    />
                                </div>

                                <div className='flex flex-row gap-4'>
                                    <InputField
                                        name='address.region'
                                        register={register}
                                        label='Region'
                                        type='text'
                                        placeholder='Region'
                                        className='w-1/2'
                                    />

                                    <InputField
                                        name='address.country'
                                        register={register}
                                        label='Country'
                                        type='text'
                                        placeholder='Country'
                                        className='w-1/2'
                                    />
                                </div>
                            </TabsContent>

                            {/* Submit Button */}
                            <Button
                                type='submit'
                                className='bg-blue-500 absolute bottom-4 w-full max-w-[580px] hover:bg-blue-600 text-white px-4'>
                                Create Warehouse
                            </Button>
                        </div>
                    </Tabs>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateWarehouseDialog;
