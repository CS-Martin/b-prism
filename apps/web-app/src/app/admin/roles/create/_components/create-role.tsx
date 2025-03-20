'use client';

import { NextStepperButton, PreviousStepperButton, Stepper, StepperContent, StepperHeader, useStepper } from 'apps/web-app/src/components/stepper';
import { RoleBasicInfoForm } from './basic-info-form';
import { RolePermissionsForm } from './permissions-form';
import { RoleReviewDetails } from './review-details';
import { Label, ScrollArea } from '@b-prism/shadcn-ui/index';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoleStore } from 'apps/web-app/src/stores/role-stores/role.store';
import { FormProvider, useForm } from 'react-hook-form';
import { useCreateRole } from 'apps/web-app/src/hooks/role.hook';
import { CreateRoleDto } from '@dto';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';

export const CreateRoleContent = () => {
    const { data: session } = useSession();
    const router = useRouter();

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

    const methods = useForm<{ name: string; description: string; adminPermissions: any; mapPermissions: any }>({
        mode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            adminPermissions: {},
            mapPermissions: {},
        },
    });

    const {
        register,
        handleSubmit,
        formState: { isValid, errors },
        control,
    } = methods;

    const { isLoading, error, createRole } = useCreateRole();
    const onSubmit = async (data: { name: string; description: string; adminPermissions: Record<string, boolean>; mapPermissions: Record<string, any> }) => {
        const createRoleDto: CreateRoleDto = {
            name: data.name,
            description: data.description,
            permissions: [],
            created_by: session?.user.given_name + ' ' + session?.user.family_name,
            created_at: new Date(),
        };

        // Extract adminPermissions
        for (const [key, value] of Object.entries(data.adminPermissions)) {
            if (value) {
                // Only add if the permission is true
                createRoleDto.permissions.push(key);
            }
        }

        // Extract mapPermissions
        for (const [key, value] of Object.entries(data.mapPermissions)) {
            if (value) {
                // Only add if the permission is true
                createRoleDto.permissions.push(key);
            }
        }

        await createRole(createRoleDto);

        if (!error) {
            router.push('/admin/roles');
        }
    };

    return (
        <FormProvider {...methods}>
            <motion.div
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
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
                                    disabled={!isValid || isLoading}
                                    onClick={handleSubmit(onSubmit)}
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
                                            <div className='w-full md:w-1/2'>
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.5 }}>
                                                    <RoleBasicInfoForm
                                                        register={register}
                                                        errors={errors}
                                                    />
                                                </motion.div>
                                            </div>
                                        </div>
                                    )}
                                    {step.title === 'Set Permissions' && (
                                        <div className='relative p-5 border rounded-lg'>
                                            <div className='pb-3 border-b'>
                                                <h2 className='mb-4 text-xl font-bold'>Set Permissions</h2>
                                                <Label>Modify what individuals on this role can do.</Label>
                                            </div>
                                            <div className='flex flex-col gap-4 md:flex-row'>
                                                <div className='relative md:w-[30%] w-full h-full md:overflow-y-hidden'>
                                                    <RoleBasicInfoForm
                                                        register={register}
                                                        errors={errors}
                                                    />
                                                </div>
                                                <div className='relative w-full md:h-[530px] md:w-[70%] md:py-5 md:px-3 md:overflow-y-auto'>
                                                    <RolePermissionsForm />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {step.title === 'Review Details' && (
                                        <RoleReviewDetails
                                            register={register}
                                            errors={errors}
                                        />
                                    )}
                                </AnimatePresence>
                            )}
                        </StepperContent>
                    </Stepper>
                </div>
            </motion.div>
        </FormProvider>
    );
};
