import { Label } from '@b-prism/shadcn-ui/index';
import { RoleBasicInfoForm } from '../../../create/_components/basic-info-form';
import { RolePermissionsForm } from '../../../create/_components/permissions-form';
import { useFormContext } from 'react-hook-form';
import { Session } from 'next-auth';

interface ReviewUpdateDetailsProps {
    session: Session;
}

export const ReviewUpdateDetails = ({ session }: ReviewUpdateDetailsProps) => {
    const { register } = useFormContext<{ name: string; description: string; adminPermissions: any; mapPermissions: any }>();

    return (
        <div>
            <div className='relative p-5 border rounded-lg'>
                <div className='pb-3 border-b'>
                    <h2 className='mb-4 text-xl font-bold'>Set Permissions</h2>
                    <Label>Modify what individuals on this role can do.</Label>
                </div>
                <div className='flex flex-col gap-4 md:flex-row'>
                    <div className='relative md:w-[30%] w-full h-full md:overflow-y-hidden'>
                        <RoleBasicInfoForm
                            register={register}
                            errors={{}}
                            readOnly={true}
                            session={session}
                        />
                    </div>
                    <div className='relative w-full md:w-[70%] md:py-5 md:px-3'>
                        <RolePermissionsForm readOnly={true} />
                    </div>
                </div>
            </div>
        </div>
    );
};
