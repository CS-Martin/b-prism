import { Label } from '@b-prism/shadcn-ui/index';
import { RoleBasicInfoForm } from '../../../create/_components/basic-info-form';
import { ADMIN_PERMISSIONS, MAP_PERMISSIONS, RolePermissionsForm } from '../../../create/_components/permissions-form';
import { RoleDto } from '@dto';
import { useForm, useFormContext, FieldValues } from 'react-hook-form';
import { useEffect } from 'react';

interface EditRoleFormProps {
    role: RoleDto;
}

export const EditRoleForm = ({ role }: EditRoleFormProps) => {
    const { register, setValue } = useFormContext<{ name: string; description: string; adminPermissions: any; mapPermissions: any }>();

    useEffect(() => {
        if (role) {
            setValue('name', role.name);
            setValue('description', role.description || '');

            const adminPermissions = {};
            ADMIN_PERMISSIONS[0].permissions.forEach((p) => {
                adminPermissions[p.id] = role.permissions.includes(p.id);
            });
            setValue('adminPermissions', adminPermissions);

            const mapPermissions = {};
            MAP_PERMISSIONS[0].permissions.forEach((p) => {
                mapPermissions[p.id] = role.permissions.includes(p.id);
            });
            setValue('mapPermissions', mapPermissions);
        }
    }, [role, setValue]);

    return (
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
                        readOnly={false}
                    />
                </div>
                <div className='relative w-full md:h-[530px] md:w-[70%] md:py-5 md:px-3 md:overflow-y-auto'>
                    <RolePermissionsForm />
                </div>
            </div>
        </div>
    );
};
