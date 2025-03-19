import { Input, Label, Textarea } from '@b-prism/shadcn-ui/index';
import { useRoleStore } from 'apps/web-app/src/stores/role-stores/role.store';

export const RoleBasicInfoForm = () => {
    const { name, description, setRoleName, setRoleDescription } = useRoleStore();

    return (
        <form className='mt-5'>
            <div className=''>
                <div>
                    <Label>Role Name</Label>
                    <Input
                        id='role_name'
                        name='role_name'
                        type='text'
                        className='mt-2 '
                        value={name}
                        onChange={(e) => setRoleName(e.target.value)}
                        required
                    />
                </div>
                <div className='mt-4'>
                    <Label>Description</Label>
                    <Textarea
                        id='role_description'
                        name='role_description'
                        value={description}
                        onChange={(e) => setRoleDescription(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className='mt-4'>
                <Label>Apply roles to:</Label>
                <Textarea
                    id='additional_info'
                    name='additional_info'
                />
            </div>
        </form>
    );
};
