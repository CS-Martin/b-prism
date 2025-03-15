'use client';

import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Label,
    ScrollArea,
    Separator,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
} from '@b-prism/shadcn-ui/index';
import { UpdateWarehouseDto, UserDto } from '@dto';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useFindOneWarehouse, useUpdateWarehouse } from 'apps/web-app/src/hooks/map.hook';
import InputField from 'apps/web-app/src/components/forms/input-field';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { error } from 'console';
import { BadRequestException } from '@nestjs/common';
import { Session } from 'next-auth';

interface DialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    warehouseId: string;
    session?: Session | null;
}

const UpdateWarehouseDialog: React.FC<DialogProps> = ({ isOpen, setIsOpen, warehouseId, session }) => {
    const { toast } = useToast();

    const { updateWarehouse } = useUpdateWarehouse();
    const { warehouse } = useFindOneWarehouse(warehouseId);

    const user = session?.user;
    const isDisabled = !session;

    // Initialize react-hook-form with default values
    const { handleSubmit, reset, register } = useForm<UpdateWarehouseDto>({
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
            user_id: user?.id,
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
        try {
            if (!user) {
                throw new BadRequestException(`You don't have permission to edit a warehouse.`);
            }

            const formattedData = {
                ...data,
            };

            if (!formattedData.longitude || !formattedData.latitude || !formattedData.name) {
                throw new Error('Warehouse name is required');
            }

            await updateWarehouse(warehouseId, formattedData, `${user.given_name} ${user.family_name}`, user.access_token);
            setIsOpen(false);
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    title: 'An error occured',
                    description: error.message,
                    variant: 'destructive',
                });
            }
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
                                            className='w-full'
                                            isDisabled={isDisabled}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor='description'>Description</Label>
                                        <Textarea
                                            {...register('description')}
                                            placeholder='Description'
                                            className='w-full'
                                            disabled={isDisabled}
                                        />
                                    </div>

                                    <div>
                                        <InputField
                                            name='capacity'
                                            register={register}
                                            label='Capacity'
                                            type='number'
                                            placeholder='Ex. 1000'
                                            isDisabled={isDisabled}
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
                                                isDisabled={isDisabled}
                                            />

                                            <InputField
                                                name='family_food_packs'
                                                register={register}
                                                label='Family Food Packs'
                                                type='number'
                                                placeholder='Ex. 1000'
                                                className='w-1/2 '
                                                isDisabled={isDisabled}
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
                                                isDisabled={isDisabled}
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

                                            <div className='flex flex-row gap-4 mt-3'>
                                                <InputField
                                                    name='non_food_items.family_kits'
                                                    register={register}
                                                    label='Family Kits'
                                                    type='number'
                                                    placeholder='Ex. 1000'
                                                    className='w-1/2'
                                                    isDisabled={isDisabled}
                                                />

                                                <InputField
                                                    name='non_food_items.sleeping_kits'
                                                    register={register}
                                                    label='Sleeping Kits'
                                                    type='number'
                                                    placeholder='Ex. 1000'
                                                    className='w-1/2'
                                                    isDisabled={isDisabled}
                                                />
                                            </div>

                                            <div className='flex flex-row gap-4 mt-3'>
                                                <InputField
                                                    name='non_food_items.hygiene_kits'
                                                    register={register}
                                                    label='Hygiene Kits'
                                                    type='number'
                                                    placeholder='Ex. 1000'
                                                    className='w-1/2'
                                                    isDisabled={isDisabled}
                                                />

                                                <InputField
                                                    name='non_food_items.kitchen_kits'
                                                    register={register}
                                                    label='Kitchen Kits'
                                                    type='number'
                                                    placeholder='Ex. 1000'
                                                    className='w-1/2'
                                                    isDisabled={isDisabled}
                                                />
                                            </div>

                                            <InputField
                                                name='non_food_items.other_nfis'
                                                register={register}
                                                label='Other NFI'
                                                type='number'
                                                placeholder='Ex. 1000'
                                                className='mt-2 mb-10'
                                                isDisabled={isDisabled}
                                            />
                                        </div>
                                    </ScrollArea>
                                </div>
                            </TabsContent>

                            {/* Address Tab */}
                            <TabsContent
                                value='address'
                                className='flex flex-col w-full gap-4'>
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
                                        isDisabled={isDisabled}
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
                                        isDisabled={isDisabled}
                                    />

                                    <InputField
                                        name='address.locality'
                                        register={register}
                                        label='Locality'
                                        type='text'
                                        placeholder='Locality'
                                        className='w-1/2'
                                        isDisabled={isDisabled}
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
                                        isDisabled={isDisabled}
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
                                        isDisabled={isDisabled}
                                    />

                                    <InputField
                                        name='address.country'
                                        register={register}
                                        label='Country'
                                        type='text'
                                        placeholder='Country'
                                        className='w-1/2'
                                        isDisabled={isDisabled}
                                    />
                                </div>
                            </TabsContent>

                            {/* Submit Button */}
                            {user && (
                                <Button
                                    type='submit'
                                    className={`bg-blue-500 absolute bottom-4 w-full max-w-[580px] hover:bg-blue-600 text-white px-4 ${user ? 'block' : 'hidden'}`}>
                                    Update Warehouse
                                </Button>
                            )}
                        </div>
                    </Tabs>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateWarehouseDialog;
