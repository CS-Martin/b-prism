import { Input, Label, Textarea } from '@b-prism/shadcn-ui/index';

export const RoleBasicInfoForm = () => {
    return (
        <div className='p-5 border rounded-lg min-h-[calc(100vh-16.5rem)] max-h-[calc(100vh-100px)]'>
            <form>
                <div className='mb-3 border-b'>
                    <h2 className='mb-4 text-xl font-bold'>Basic Details</h2>
                    <Label className=''>Please enter the basic information for the new role.</Label>
                </div>
                <div className='mt-8 md:w-1/2'>
                    <div>
                        <Label>Role Name</Label>
                        <Input
                            id='role_name'
                            name='role_name'
                            type='text'
                            className='mt-2 '
                            required
                        />
                    </div>
                    <div className='mt-4'>
                        <Label>Description</Label>
                        <Textarea
                            id='role_description'
                            name='role_description'
                            required
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};
