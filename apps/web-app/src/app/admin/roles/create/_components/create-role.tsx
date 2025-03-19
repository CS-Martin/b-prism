'use client';

import { NextStepperButton, PreviousStepperButton, Stepper, StepperContent, StepperHeader } from 'apps/web-app/src/components/stepper';
import { RoleBasicInfoForm } from './basic-info-form';
import { RolePermissionsForm } from './permissions-form';
import { RoleReviewDetails } from './review-details';
import { Label, ScrollArea } from '@b-prism/shadcn-ui/index';
import { motion, AnimatePresence } from 'framer-motion';

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
        <motion.div
            initial={{ opacity: 0 }} // Initial state (hidden and slightly to the right)
            animate={{ opacity: 1 }} // Animate to visible and centered
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} // Animation duration
        >
            <div className='p-5 mt-5 rounded-md prism-card-bg md:h-[calc(100vh-100px)] overflow-y-hidden'>
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
                            <AnimatePresence mode='wait'>
                                {step.title === 'Basic Information' && (
                                    <div className='relative p-5 rounded-lg border min-h-[calc(100vh-16.5rem)] max-h-[calc(100vh-100px)]'>
                                        <div className='pb-3 border-b'>
                                            <h2 className='mb-4 text-xl font-bold'>Basic Information</h2>
                                            <Label>Please enter the basic information for the new role.</Label>
                                        </div>
                                        <div className='w-1/2'>
                                            <motion.div
                                                initial={{ opacity: 0 }} // Initial state (hidden and slightly to the right)
                                                animate={{ opacity: 1 }} // Animate to visible and centered
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.5 }} // Animation duration
                                            >
                                                <RoleBasicInfoForm />
                                            </motion.div>
                                        </div>
                                    </div>
                                )}
                                {step.title === 'Set Permissions' && (
                                    <div className='relative border rounded-lg p-5 min-h-[calc(100vh-16.5rem)] max-h-[calc(100vh-100px)]'>
                                        <div className='pb-3 border-b'>
                                            <h2 className='mb-4 text-xl font-bold'>Set Permissions</h2>
                                            <Label>Modify what individuals on this role can do.</Label>
                                        </div>
                                        <div className='flex gap-4 h-[calc(100vh-20rem)]'>
                                            {/* Fixed RoleBasicInfoForm */}
                                            <div className='w-[30%] h-full overflow-y-hidden'>
                                                <RoleBasicInfoForm />
                                            </div>
                                            {/* Scrollable RolePermissionsForm */}
                                            <div className='w-[70%] py-5 px-3 h-fit overflow-y-auto'>
                                                <RolePermissionsForm />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {step.title === 'Review Details' && <RoleReviewDetails />}
                            </AnimatePresence>
                        )}
                    </StepperContent>
                </Stepper>
            </div>
        </motion.div>
    );
};
