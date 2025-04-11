'use client';

import { NextStepperButton, PreviousStepperButton, Stepper, StepperContent, StepperHeader } from 'apps/web-app/src/components/stepper';
import { AnimatePresence, motion } from 'framer-motion';
import { notFound, useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { EditRoleForm } from './edit-role-form';
import { FormProvider, useForm } from 'react-hook-form';
import { CreateRoleDto } from '@dto';
import { ReviewUpdateDetails } from './review-details';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { useRoleStore } from 'apps/web-app/src/stores/role-stores/role.store';
import { Session } from 'next-auth';
import { Label } from '@b-prism/shadcn-ui/index';
import { useProgress } from '@bprogress/next';
import { UnauthorizedException } from '@nestjs/common';

interface UpdateRoleContentProps {
    session: Session;
}
export const UpdateRoleContent = ({ session }: UpdateRoleContentProps) => {
    const { start: loadStart, stop: loadStop } = useProgress();
    const router = useRouter();
    const params = useParams<{ roleId: string }>();
    const { role, isLoading, error, fetchRoleById, updateRole } = useRoleStore();
    const methods = useForm<{ name: string; description: string; adminPermissions: Record<string, boolean>; mapPermissions: Record<string, any> }>();
    const { handleSubmit } = methods;
    const { toast } = useToast();

    if (isLoading) {
        loadStart();
    } else {
        loadStop();
    }

    if (!session?.user || !session?.user.access_token) {
        toast({
            title: 'Session expired',
            description: 'Please login again to continue.',
            variant: 'destructive',
        });

        notFound();
    }

    useEffect(() => {
        fetchRoleById(params.roleId, session?.user.access_token);
    }, [params.roleId]);

    if (error) {
        toast({
            title: 'Error fetching role',
            description: error,
            variant: 'destructive',
        });

        return;
    }

    const steps = [
        {
            title: 'Edit Role Information',
            description: 'Enter the data you wish to update.',
        },
        {
            title: 'Review Details',
            description: 'Make sure you entered the correct details before proceeding.',
        },
    ];

    const onSubmit = async (data: { name: string; description: string; adminPermissions: Record<string, boolean>; mapPermissions: Record<string, any> }) => {
        // Check if data and role is equal
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

        try {
            loadStart();
            await updateRole(params.roleId, createRoleDto, session?.user.given_name + ' ' + session?.user.family_name, session.user.access_token);
        } catch (error: unknown) {
            console.error('Error updating warehouse:', error);

            let errorMessage = 'An unexpected error occurred. Please try again.';

            if (error instanceof UnauthorizedException) {
                errorMessage = error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            loadStop();
        }

        if (!error) {
            router.push('/admin/roles');
        }
    };

    return (
        <>
            {role && (
                <motion.div
                    className='px-5 mt-5'
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}>
                    <div className='relative p-5 border rounded-md shadow-sm bg-sidebar'>
                        <h1 className='mb-2 text-xl font-semibold'>Edit Role</h1>
                        <Label>Please fill in the details below to update the role.</Label>
                        <FormProvider {...methods}>
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
                                            completeTitle='Update Role'
                                            disabled={isLoading}
                                            isLoading={isLoading}
                                            onClick={handleSubmit(onSubmit)}
                                        />
                                    </div>
                                </div>
                                <StepperContent>
                                    {(step) => (
                                        <AnimatePresence mode='wait'>
                                            {step.title === 'Edit Role Information' && (
                                                <EditRoleForm
                                                    session={session}
                                                    role={role}
                                                />
                                            )}
                                            {step.title === 'Review Details' && <ReviewUpdateDetails session={session} />}
                                        </AnimatePresence>
                                    )}
                                </StepperContent>
                            </Stepper>
                        </FormProvider>
                    </div>
                </motion.div>
            )}
        </>
    );
};
