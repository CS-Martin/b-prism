'use client';

import { useState } from 'react';
import { UploadDropzone } from '../../../../../utils/uploadingthing';
import Image from 'next/image';
import { Button, Label } from '@b-prism/shadcn-ui/index';
import { Ghost } from 'lucide-react';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { title } from 'process';
import Link from 'next/link';
import { authService } from 'apps/web-app/src/services/authentication.service';
import { UpdateUserDto } from '@dto';

export default function UploadThing() {
    const { toast } = useToast();
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploadComplete, setIsUploadComplete] = useState<boolean>(true);
    const [isUploadZoneDisabled, setIsUploadZoneDisabled] = useState<boolean>(false);

    const handleFileChange = (files: File[]) => {
        if (files.length > 0) {
            const file = files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                if (e.target?.result) {
                    setPreview(e.target.result as string);
                }
            };

            reader.readAsDataURL(file);

            toast({
                title: 'Success',
                description: 'Successfully added an image.',
                variant: 'success',
            });
        }
    };

    // Store key into id_image_url of a user
    const onSubmit = async (id: string, key: string) => {
        const user: UpdateUserDto = new UpdateUserDto();
        user.id_image_url = key;

        await authService.update(id, user);
    };

    return (
        <div className='bg-[#18181A] w-[550px] rounded-lg  border-gray-600 border'>
            <div className='p-5 border-b'>
                <p className='text-lg font-semibold mb-3'>Upload Image</p>
                <p className='text-gray-400'>Your image will be used to verify your identity that will give you access to contribute to the system.</p>
            </div>
            {/* Show preview if an image is selected */}
            <div className='p-5'>
                <p className='text-gray-600 font-semibold mb-2'>Preview:</p>
                {preview ? (
                    <div className=''>
                        <Image
                            src={preview}
                            width={500}
                            height={500}
                            alt='Selected file preview'
                            className='w-full rounded-md h-[230px] object-cover shadow-md'
                        />
                    </div>
                ) : (
                    <div>
                        <Image
                            src={'/img/no-img-found.png'}
                            width={500}
                            height={500}
                            alt='Selected file preview'
                            className='w-full rounded-md h-[230px] object-cover shadow-md'
                        />
                    </div>
                )}

                <div className='mt-5'>
                    <Label className='text-gray-500 font-semibold '>Upload Image</Label>
                    <div className='border-2 border-gray-500 rounded-lg mt-2 border-dashed'>
                        <UploadDropzone
                            endpoint='imageUploader'
                            disabled={isUploadZoneDisabled}
                            onChange={(files) => {
                                handleFileChange(files);
                            }}
                            onClientUploadComplete={(res) => {
                                setIsUploadComplete(false);
                                setIsUploadZoneDisabled(true);

                                console.log('onClientUploadComplete', res);

                                const user_id: string = res[0].serverData.uploadedBy!;
                                const key: string = res[0].key;

                                onSubmit(user_id, key);

                                toast({
                                    title: 'Success!',
                                    description: 'You have successfully submitted your ID for review.',
                                    variant: 'success',
                                });
                            }}
                            onUploadError={(error: Error) => {
                                console.log(`Error! ${error.message}`);

                                toast({
                                    title: 'Error!',
                                    description: `${error.message}`,
                                    variant: 'destructive',
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className='p-5 flex justify-end gap-2 border border-t'>
                <Button
                    asChild
                    variant='ghost'>
                    <Link href={'/home'}>Skip</Link>
                </Button>
                <Button
                    disabled={isUploadComplete}
                    className='px-5 bg-blue-500 hover:bg-blue-600 text-white'>
                    <Link href={'/home'}>Complete</Link>
                </Button>
            </div>
        </div>
    );
}
