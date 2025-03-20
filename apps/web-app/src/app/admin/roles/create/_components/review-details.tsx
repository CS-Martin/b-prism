import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { RoleBasicInfoForm } from './basic-info-form';
import { RolePermissionsForm } from './permissions-form';

interface RoleReviewDetailsProps {
    register: UseFormRegister<{ name: string; description: string; adminPermissions: any; mapPermissions: any }>;
    errors: FieldErrors<{ name: string; description: string; adminPermissions: any; mapPermissions: any }>;
}

export const RoleReviewDetails = ({ register, errors }: RoleReviewDetailsProps) => {
    return (
        <div className='relative p-5 rounded-lg border min-h-[calc(100vh-16.5rem)] max-h-[calc(100vh-100px)]'>
            <div className='pb-3 border-b'>
                <h2 className='mb-4 text-xl font-bold'>Review Details</h2>
                <p>Review the details of the role you are about to create.</p>
            </div>
            <div className='flex flex-row gap-6 mt-5'>
                {/* Non-editable RoleBasicInfoForm */}
                <div className='w-[30%]'>
                    <RoleBasicInfoForm
                        register={register}
                        errors={errors}
                        readOnly={true}
                    />
                </div>

                {/* Non-editable RolePermissionsForm */}
                <div className='w-[70%]'>
                    <RolePermissionsForm readOnly={true} />
                </div>
            </div>
        </div>
    );
};
