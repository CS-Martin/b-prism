'use client';

import { Label } from '@b-prism/shadcn-ui/index';
import { NextStepperButton, PreviousStepperButton, Stepper, StepperContent, StepperHeader } from 'apps/web-app/src/components/stepper';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const UpdateRoleContent = () => {
    const params = useParams<{ roleId: string }>();

    const steps = [
        {
            title: 'Edit Role Information.',
            description: 'Enter the data you wish to update.',
        },
        {
            title: 'Review Details',
            description: 'Make sure you entered the correct details before proceeding.',
        },
    ];
    return (
        <motion.div
            animate={{ opacity: 1 }}
            exit={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <div className='p-5 relative mt-5 rounded-md prism-card-bg md:h-[calc(100vh-100px)] overflow-y-hidden'>
                <h1 className='mb-4 text-xl font-semibold'>Create New Role</h1>
                <Stepper steps={steps}>
                    <div className='flex flex-col justify-between md:flex-row'>
                        <div className='flex items-center w-full md:w-1/2'>
                            <StepperHeader className='lg:w-[80%] md:w-[100%] py-5' />
                        </div>
                        <div className='flex flex-col items-center justify-end gap-3 mb-4 md:mb-0 md:w-1/2 md:flex-row gap-x-3'>
                            <PreviousStepperButton
                                className='w-full md:w-[20%] lg:w-[15%]'
                                variant={'outline'}
                            />
                            <NextStepperButton
                                name='Continue'
                                className='w-full md:w-[30%] lg:w-[20%]'
                                completeTitle='Create Role'
                            />
                        </div>
                    </div>
                    <StepperContent>
                        {(step) => (
                            <AnimatePresence mode='wait'>
                                {step.title === 'Edit Role Information' && <div></div>}
                                {step.title === 'Review Details' && <div></div>}
                            </AnimatePresence>
                        )}
                    </StepperContent>
                </Stepper>
            </div>
        </motion.div>
    );
};
