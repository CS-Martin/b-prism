'use client';

import { NextStepperButton, PreviousStepperButton, Stepper, StepperContent, StepperHeader } from 'apps/web-app/src/components/stepper';
import { RoleBasicInfoForm } from './basic-info-form';
import { RolePermissionsForm } from './permissions-form';
import { RoleReviewDetails } from './review-details';

export const CreateRoleContent = () => {
    const steps = [
        {
            title: 'Basic Information',
            description: 'Enter the basic information of the role.',
        },
        {
            title: 'Set Permissions',
            description: 'Assign permissions to the role.',
        },
        {
            title: 'Review Details',
            description: 'Review and create the role.',
        },
    ];

    return (
        <div className='p-5 mt-5 rounded-md prism-card-bg md:h-[calc(100vh-100px)] overflow-y-auto'>
            <h1 className='mb-4 text-xl font-semibold'>Create New Role</h1>
            <Stepper steps={steps}>
                <div className='flex flex-row justify-between'>
                    <div className='flex items-center w-1/2'>
                        <StepperHeader className='lg:w-[80%] md:w-[100%] py-5' />
                    </div>
                    <div className='flex items-center justify-end w-1/2 gap-x-3'>
                        <PreviousStepperButton variant={'outline'} />
                        <NextStepperButton
                            name='Continue'
                            completeTitle='Create Role'
                        />
                    </div>
                </div>
                <StepperContent>
                    {(step) => (
                        <div>
                            {step.title === 'Basic Information' && <RoleBasicInfoForm />}
                            {step.title === 'Set Permissions' && <RolePermissionsForm />}
                            {step.title === 'Review Details' && <RoleReviewDetails />}
                        </div>
                    )}
                </StepperContent>
            </Stepper>
        </div>
    );
};
