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
import InputField from 'apps/web-app/src/components/forms/input-field';
import { useUpdateDispensingPoint, useFindOneDispensingPoint } from 'apps/web-app/src/hooks/map.hook';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface DialogProps {
    dispensingPointId: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const UpdateDispensingPointDialog: React.FC<DialogProps> = ({ dispensingPointId, isOpen, setIsOpen }) => {
    const { data: session } = useSession();
    const { dispensingPoint } = useFindOneDispensingPoint(dispensingPointId);
    const { updateDispensingPoint } = useUpdateDispensingPoint();

    const user: UserDto = session?.user as UserDto;

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
            user_id: user.id,
        };

        await updateDispensingPoint(dispensingPointId, formattedData, `${user.given_name} ${user.family_name}`);
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
                                        <DialogDescription>Update the details of the dispensing point.</DialogDescription>
                                    </DialogHeader>

                                    <Separator orientation='horizontal' />

                                    <div>
                                        <InputField
                                            name='name'
                                            register={register}
                                            label='Name'
                                            type='text'
                                            placeholder='Dispensing Point Name'
                                            className='w-full'
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

                            {/* Address Tab */}
                            <TabsContent value='address'>
                                <div className='flex flex-col gap-4'>
                                    <DialogHeader>
                                        <DialogTitle>Dispensing Point Address</DialogTitle>
                                        <DialogDescription>Update the address details as needed.</DialogDescription>
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
                                        />
                                        <InputField
                                            name='address.post_code'
                                            register={register}
                                            label='Post Code'
                                            type='text'
                                            placeholder='Post Code'
                                            className='w-full'
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
                                        />
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
                                            className='w-full'
                                        />
                                        <InputField
                                            name='address.country'
                                            register={register}
                                            label='Country'
                                            type='text'
                                            placeholder='Country'
                                            className='w-full'
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* Submit Button */}
                            <Button
                                type='submit'
                                className='bg-blue-500 absolute bottom-4 w-full max-w-[583px] hover:bg-blue-600 text-white px-4'>
                                Update Dispensing Point
                            </Button>
                        </div>
                    </Tabs>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateDispensingPointDialog;
