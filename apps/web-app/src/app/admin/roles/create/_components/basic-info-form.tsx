import { Input, Label, Textarea } from '@b-prism/shadcn-ui/index';
import { FieldErrors, SubmitHandler, useForm, UseFormRegister } from 'react-hook-form';

interface RoleBasicInfoFormProps {
    register: UseFormRegister<{ name: string; description: string; adminPermissions: any; mapPermissions: any }>;
    errors: FieldErrors<{ name: string; description: string; adminPermissions: any; mapPermissions: any }>;
}

export const RoleBasicInfoForm = ({ register, errors }: RoleBasicInfoFormProps) => {
    return (
        <div className='mt-5'>
            <div className=''>
                <div>
                    <Label>Role Name</Label>
                    <Input
                        id='role_name'
                        type='text'
                        className='mt-2 '
                        {...register('name', { required: 'Role Name is required.' })}
                    />
                    {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name.message}</p>}
                </div>

                <div className='mt-4'>
                    <Label>Description</Label>
                    <Textarea
                        id='role_description'
                        {...register('description', { required: 'Description is required.' })}
                    />
                    {errors.description && <p className='mt-1 text-sm text-red-500'>{errors.description.message}</p>}
                </div>
            </div>

            <div className='mt-4'>
                <Label>Apply roles to:</Label>
                <Textarea
                    id='additional_info'
                    name='additional_info'
                />
            </div>
        </div>
    );
};
