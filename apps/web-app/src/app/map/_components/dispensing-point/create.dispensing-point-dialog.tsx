// Refactored CreateDispensingPointDialog component
'use client';

import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
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
    Separator,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
} from '@b-prism/shadcn-ui/index';
import { CoordinatesType } from '@b-prism/types';
import { CreateDispensingPointDto, DispensingPointDto } from '@dto';
import { BadRequestException } from '@nestjs/common';
import { Type } from '@prisma/client';
import InputField from 'apps/web-app/src/components/forms/input-field';
import { useCreateDispensingPoint } from 'apps/web-app/src/hooks/dispensing-point.hook';
import { useGetAddress } from 'apps/web-app/src/hooks/map.hook';
import { useDispensingPointsStore } from 'apps/web-app/src/stores/map-stores/dispensing-point.store';
import { Session } from 'next-auth';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface DialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    coordinates: CoordinatesType;
    session?: Session | null;
}

const CreateDispensingPointDialog: React.FC<DialogProps> = ({ isOpen, setIsOpen, coordinates, session }) => {
    const { toast } = useToast();
    const { getAddress, address } = useGetAddress();
    const { createDispensingPoint } = useCreateDispensingPoint();

    const user = session?.user;

    const {
        handleSubmit,
        control,
        reset,
        register,
        formState: { errors },
    } = useForm<CreateDispensingPointDto>({
        defaultValues: {
            type: 'dispensing_point' as Type,
            name: '',
            description: '',
            longitude: coordinates.longitude,
            latitude: coordinates.latitude,
            capacity: 0,
            address: {
                street: '',
                post_code: '',
                locality: '',
                place: '',
                region: '',
                country: '',
            },
        },
    });

    // Fetch address on dialog open
    useEffect(() => {
        if (isOpen && coordinates.longitude && coordinates.latitude) {
            getAddress(coordinates.longitude, coordinates.latitude);
        }
    }, [coordinates]);

    // Update form fields when address or coordinates changes
    useEffect(() => {
        if (address) {
            reset((prev) => ({ ...prev, address }));
        }
    }, [address]);

    useEffect(() => {
        reset({ longitude: coordinates.longitude, latitude: coordinates.latitude });
    }, [coordinates, reset]);

    const onSubmit = async (data: CreateDispensingPointDto) => {
        try {
            if (!user) {
                throw new BadRequestException(`You don't have permission to create a dispensing point.`);
            }

            const formattedData = {
                ...data,
                address,
                user_id: user.id,
            };

            if (!formattedData.name) {
                throw new Error('Dispensing Point Name is required');
            }

            const newDispensingPoint: DispensingPointDto | undefined = await createDispensingPoint(formattedData, `${user.given_name} ${user.family_name}`, user.accessToken);

            if (newDispensingPoint) {
                useDispensingPointsStore.getState().addDispensingPoint(newDispensingPoint);
            }

            setIsOpen(false);
            reset();
        } catch (error) {
            console.error('Error creating dispensing point:', error);
            toast({
                title: 'An error occurred!',
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
            <DialogContent className='h-full max-h-[460px]'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Tabs
                        defaultValue='general'
                        className='flex flex-row gap-4'>
                        <TabsList className='flex flex-col h-fit w-full max-w-[150px]'>
                            <TabsTrigger
                                value='general'
                                className='w-full'>
                                General
                            </TabsTrigger>
                            <TabsTrigger
                                value='address'
                                className='w-full'>
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
                                        <DialogTitle>Dispensing Point Information</DialogTitle>
                                        <DialogDescription>Please enter the details of the dispensing point.</DialogDescription>
                                    </DialogHeader>

                                    <Separator orientation='horizontal' />

                                    <div>
                                        <InputField
                                            name='name'
                                            register={register}
                                            label='Name'
                                            type='text'
                                            placeholder='Dispensing Point Name'
                                            rules={{ required: 'Dispensing Point Name is required' }}
                                            errors={errors.name}
                                            isDisabled={!session}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor='description'>Description</Label>
                                        <Textarea
                                            id='description'
                                            {...register('description')}
                                            className='mt-1 rounded-sm'
                                            placeholder='Description'
                                            disabled={!session}
                                        />
                                    </div>

                                    <div>
                                        <InputField
                                            name='capacity'
                                            register={register}
                                            label='Capacity'
                                            type='number'
                                            placeholder='Ex. 1000'
                                            isDisabled={!session}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Address Tab */}
                            <TabsContent value='address'>
                                <div className='flex flex-col gap-4'>
                                    <DialogHeader>
                                        <DialogTitle>Dispensing Point Address</DialogTitle>
                                        <DialogDescription>Auto-filled based on marker position. Edit if needed.</DialogDescription>
                                    </DialogHeader>

                                    <Separator orientation='horizontal' />

                                    <div className='flex flex-row gap-4'>
                                        <InputField
                                            name='address.street'
                                            register={register}
                                            label='Street'
                                            type='text'
                                            placeholder='Street'
                                            className='w-full'
                                            isDisabled={!session}
                                        />
                                        <InputField
                                            name='address.post_code'
                                            register={register}
                                            label='Post Code'
                                            type='text'
                                            placeholder='Post Code'
                                            className='w-full'
                                            isDisabled={!session}
                                        />
                                    </div>

                                    <div className='flex flex-row gap-4'>
                                        <InputField
                                            name='address.locality'
                                            register={register}
                                            label='Locality'
                                            type='text'
                                            placeholder='Locality'
                                            className='w-full'
                                            isDisabled={!session}
                                        />
                                        <InputField
                                            name='address.place'
                                            register={register}
                                            label='Place'
                                            type='text'
                                            placeholder='Place'
                                            className='w-full'
                                            isDisabled={!session}
                                        />
                                    </div>

                                    <div className='flex flex-row gap-4'>
                                        <InputField
                                            name='address.region'
                                            register={register}
                                            label='Region'
                                            type='text'
                                            placeholder='Region'
                                            className='w-full'
                                            isDisabled={!session}
                                        />
                                        <InputField
                                            name='address.country'
                                            register={register}
                                            label='Country'
                                            type='text'
                                            placeholder='Country'
                                            className='w-full'
                                            isDisabled={!session}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Submit Button */}
                            {session && (
                                <Button
                                    type='submit'
                                    className='bg-blue-500 absolute bottom-4 w-full max-w-[583px] hover:bg-blue-600 text-white px-4'>
                                    Create Dispensing Point
                                </Button>
                            )}
                        </div>
                    </Tabs>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateDispensingPointDialog;
