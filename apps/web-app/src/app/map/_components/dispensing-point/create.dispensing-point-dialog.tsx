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
import { CreateDispensingPointDto, UserDto } from '@dto';
import { BadRequestException } from '@nestjs/common';
import { Type } from '@prisma/client';
import InputField from 'apps/web-app/src/components/forms/input-field';
import { useCreateDispensingPoint, useGetAddress } from 'apps/web-app/src/hooks/map.hook';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface MarkerType {
    longitude: string;
    latitude: string;
}

interface DialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    marker: MarkerType;
    fetchAllDispensingPoints: () => void;
}

const AddressField = ({ id, label, placeholder, control, fieldName }: { id: string; label: string; placeholder: string; control: any; fieldName: string }) => (
    <div className='w-1/2'>
        <Label htmlFor={id}>{label}</Label>
        <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
                <Input
                    {...field}
                    id={id}
                    className='rounded-sm mt-1'
                    placeholder={placeholder}
                />
            )}
        />
    </div>
);

const CreateDispensingPointDialog: React.FC<DialogProps> = ({ isOpen, setIsOpen, marker, fetchAllDispensingPoints }) => {
    const { toast } = useToast();
    const { data: session } = useSession();
    const { getAddress, address } = useGetAddress();
    const { createDispensingPoint } = useCreateDispensingPoint();

    const user: UserDto = session?.user as UserDto;

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
            longitude: marker.longitude,
            latitude: marker.latitude,
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
        if (isOpen && marker.longitude && marker.latitude) {
            getAddress(marker.longitude, marker.latitude);
        }
    }, [isOpen, marker]);

    // Update form fields when address or marker changes
    useEffect(() => {
        if (address) {
            reset((prev) => ({ ...prev, address }));
        }
    }, [address, reset]);

    useEffect(() => {
        reset({ longitude: marker.longitude, latitude: marker.latitude });
    }, [marker, reset]);

    const onSubmit = async (data: CreateDispensingPointDto) => {
        try {
            if (!user) {
                throw new BadRequestException(`You don't have permission to create a dispensing points.`);
            }

            const formattedData = {
                ...data,
                address,
                user_id: (session?.user as UserDto)?.id,
            };

            if (formattedData.name === '') {
                throw new Error('Dispensing Point Name is required');
            }

            await createDispensingPoint(formattedData, `${user.given_name} ${user.family_name}`);
            fetchAllDispensingPoints();
            setIsOpen(false);
        } catch (error) {
            console.error('Error creating dispensing point:', error);
            toast({
                title: 'An error occured',
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
                                            className='rounded-sm mt-1'
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
