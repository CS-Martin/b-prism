// UpdateDispensingPointDialog component
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
    Separator,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Textarea,
} from '@b-prism/shadcn-ui/index';
import { UpdateDispensingPointDto, UserDto } from '@dto';
import { Type } from '@prisma/client';
import { useUpdateDispensingPoint, useFindOneDispensingPoint } from 'apps/web-app/src/hooks/map.hook';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface DialogProps {
    dispensingPointId: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const AddressField = ({
    id,
    label,
    placeholder,
    control,
    fieldName,
}: {
    id: string;
    label: string;
    placeholder: string;
    control: any;
    fieldName: string;
}) => (
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

const UpdateDispensingPointDialog: React.FC<DialogProps> = ({ dispensingPointId, isOpen, setIsOpen }) => {
    const { data: session } = useSession();
    const { dispensingPoint } = useFindOneDispensingPoint(dispensingPointId);
    const { updateDispensingPoint } = useUpdateDispensingPoint();

    const { handleSubmit, control, reset, register } = useForm<UpdateDispensingPointDto>({
        defaultValues: {
            type: 'dispensing_point' as Type,
            name: '',
            description: '',
            longitude: '',
            latitude: '',
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

    useEffect(() => {
        if (dispensingPoint) {
            const { id, ...dispensingPointWithoutId } = dispensingPoint;
            reset(dispensingPointWithoutId);
        }
    }, [dispensingPoint, reset]);

    const onSubmit = async (data: UpdateDispensingPointDto) => {
        const formattedData = {
            ...data,
            user_id: (session?.user as UserDto)?.id,
        };

        await updateDispensingPoint(dispensingPointId, formattedData);
        setIsOpen(false);
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}>
            <DialogTrigger asChild>Open</DialogTrigger>
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
                                        <DialogTitle>Update Dispensing Point</DialogTitle>
                                        <DialogDescription>
                                            Update the details of the dispensing point.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <Separator orientation='horizontal' />

                                    <div>
                                        <Label htmlFor='name'>Name</Label>
                                        <Input
                                            id='name'
                                            {...register('name', { required: true })}
                                            className='rounded-sm mt-1'
                                            placeholder='Dispensing Point Name'
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor='description'>Description</Label>
                                        <Textarea
                                            id='description'
                                            {...register('description')}
                                            className='rounded-sm mt-1'
                                            placeholder='Description'
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor='capacity'>Capacity</Label>
                                        <Input
                                            id='capacity'
                                            type='number'
                                            {...register('capacity', { required: true, valueAsNumber: true })}
                                            className='rounded-sm mt-1'
                                            placeholder='Ex. 1000'
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Address Tab */}
                            <TabsContent value='address'>
                                <div className='flex flex-col gap-4'>
                                    <DialogHeader>
                                        <DialogTitle>Dispensing Point Address</DialogTitle>
                                        <DialogDescription>Update the address details as needed.</DialogDescription>
                                    </DialogHeader>

                                    <Separator orientation='horizontal' />

                                    <div className='flex flex-row gap-4'>
                                        <AddressField
                                            id='street'
                                            label='Street'
                                            placeholder='Street'
                                            control={control}
                                            fieldName='address.street'
                                        />
                                        <AddressField
                                            id='post_code'
                                            label='Post Code'
                                            placeholder='Post Code'
                                            control={control}
                                            fieldName='address.post_code'
                                        />
                                    </div>

                                    <div className='flex flex-row gap-4'>
                                        <AddressField
                                            id='locality'
                                            label='Locality'
                                            placeholder='Locality'
                                            control={control}
                                            fieldName='address.locality'
                                        />
                                        <AddressField
                                            id='place'
                                            label='Place'
                                            placeholder='Place'
                                            control={control}
                                            fieldName='address.place'
                                        />
                                    </div>

                                    <div className='flex flex-row gap-4'>
                                        <AddressField
                                            id='region'
                                            label='Region'
                                            placeholder='Region'
                                            control={control}
                                            fieldName='address.region'
                                        />
                                        <AddressField
                                            id='country'
                                            label='Country'
                                            placeholder='Country'
                                            control={control}
                                            fieldName='address.country'
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Submit Button */}
                            <Button
                                type='submit'
                                className='bg-blue-500 absolute bottom-4 w-full max-w-[484px] hover:bg-blue-600 text-white px-4'>
                                Submit
                            </Button>
                        </div>
                    </Tabs>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateDispensingPointDialog;
