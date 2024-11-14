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
import { CreateDispensingPointDto, UserDto } from '@dto';
import { useCreateDispensingPoint } from 'apps/web-app/src/hooks/map.hook';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

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

const CreateDispensingPointDialog: React.FC<DialogProps> = ({
    isOpen,
    setIsOpen,
    marker,
    fetchAllDispensingPoints,
}) => {
    const { data: session } = useSession();
    const [dispensingPointData, setDispensingPointData] = useState<CreateDispensingPointDto>({
        type: 'dispensing-point',
        name: '',
        description: '',
        longitude: marker.longitude,
        latitude: marker.latitude,
        capacity: 0,
        userId: (session?.user as UserDto)?.id ?? undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    useEffect(() => {
        setDispensingPointData((prevData) => ({
            ...prevData,
            longitude: marker.longitude,
            latitude: marker.latitude,
        }));
    }, [marker]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDispensingPointData({ ...dispensingPointData, [name]: value });
    };

    const { createDispensingPoint } = useCreateDispensingPoint(dispensingPointData);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await createDispensingPoint();

        fetchAllDispensingPoints();

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
                        <DialogTitle>Dispensing Point Information</DialogTitle>
                        <DialogDescription>Please enter the details of the dispensing point.</DialogDescription>
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
                                    placeholder='Dispensing Point Name'
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

export default CreateDispensingPointDialog;
