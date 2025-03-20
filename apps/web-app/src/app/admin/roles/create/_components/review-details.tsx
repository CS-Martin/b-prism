import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { RoleBasicInfoForm } from './basic-info-form';
import { RolePermissionsForm } from './permissions-form';

interface RoleReviewDetailsProps {
    register: UseFormRegister<{ name: string; description: string; adminPermissions: any; mapPermissions: any }>;
    errors: FieldErrors<{ name: string; description: string; adminPermissions: any; mapPermissions: any }>;
}

export const RoleReviewDetails = ({ register, errors }: RoleReviewDetailsProps) => {
    return (
        <div className='relative p-5 border rounded-lg'>
            <div className='pb-3 border-b'>
                <h2 className='mb-4 text-xl font-bold'>Review Details</h2>
                <p>Review the details of the role you are about to create.</p>
            </div>
            <div className='flex flex-col gap-6 mt-5 md:flex-row'>
                {/* Non-editable RoleBasicInfoForm */}
                <div className='md:w-[30%]'>
                    <RoleBasicInfoForm
                        register={register}
                        errors={errors}
                        readOnly={true}
                    />
                </div>

                {/* Non-editable RolePermissionsForm */}
                <div className='md:w-[70%]'>
                    <RolePermissionsForm readOnly={true} />
                </div>
            </div>
        </div>
    );
};
