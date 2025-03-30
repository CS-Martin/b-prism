'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { Button, Input } from '@b-prism/shadcn-ui/index';
import { PrismButton } from 'apps/web-app/src/components/prism-button';
import Image from 'next/image';
import { authService } from '../../../../services/authentication.service';
import { debounce } from 'lodash';
import { Eye, EyeOff } from 'lucide-react';
import { useProgress } from '@bprogress/next';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const LoginForm = () => {
    const { start: loadStart, stop: loadStop } = useProgress();
    const { toast } = useToast();
    const router = useRouter();

    // --- State Management ---

    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [showPasswordInput, setShowPasswordInput] = useState(false);

    // --- React Hook Form ---

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting: rhfIsSubmitting },
        setError: setFormError,
        trigger,
    } = useForm({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const watchedEmail = watch('email');

    // --- Effects ---

    useEffect(() => {
        const isLoading = rhfIsSubmitting || isSubmittingLogin || isCheckingEmail;

        if (isLoading) {
            loadStart();
        } else {
            loadStop();
        }

        // Cleanup function to stop loading
        return () => loadStop();
    }, [isSubmittingLogin, isCheckingEmail, loadStart, loadStop]);

    // Use useCallback to memoize the debounced function
    const checkEmailExistence = useCallback(
        debounce(async (email: string) => {
            setIsCheckingEmail(true);
            try {
                const user = await authService.findUserByEmailWithoutThrow(email);
                console.log('User found:', user);
                setShowPasswordInput(Boolean(user));
                console.log('showPasswordInput:', showPasswordInput);
                // If user exists, password becomes required (we can trigger validation or handle in submit)
                if (user) {
                    // Optionally trigger password validation if needed here
                    // await trigger("password");
                } else {
                    // Clear potential API error if user not found after typing
                    setFormError('email', {
                        type: 'manual',
                        message: 'Email not found. Please check your email address.',
                    });
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                setShowPasswordInput(false);
            } finally {
                setIsCheckingEmail(false);
            }
        }, 1000),
        [setFormError, trigger],
    );

    useEffect(() => {
        const isValidEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedEmail || '');

        if (isValidEmailFormat) {
            checkEmailExistence(watchedEmail);
        } else {
            setShowPasswordInput(false);
            checkEmailExistence.cancel();
        }

        // Cleanup function for debounce cancellation
        return () => checkEmailExistence.cancel();
    }, [watchedEmail, checkEmailExistence]);

    // --- Handlers ---

    const handleLogin = async (provider: 'credentials' | 'google', credentials?: LoginFormInputs) => {
        setIsSubmittingLogin(true); // Use specific loading state

        try {
            const result = await signIn(provider, {
                redirect: false,
                ...(provider === 'credentials' && credentials),
            });

            if (result?.error) {
                // Handle specific NextAuth errors
                let errorMessage = result.error;
                if (result.error === 'CredentialsSignin') {
                    errorMessage = 'Invalid email or password.';
                    // Set error on the password field for better UX
                    setFormError('password', { type: 'manual', message: errorMessage });
                } else {
                    // Set a general error maybe? Or just toast it.
                    setFormError('root.serverError', { type: 'manual', message: errorMessage });
                }
                throw new Error(errorMessage); // Throw to be caught below for toast
            }

            // Success path
            const updatedSession = await getSession();

            // Check if profile completion is needed BEFORE showing success toast
            if (!updatedSession?.user?.id_image_url || updatedSession.user.id_image_url === '') {
                setIsSubmittingLogin(false); // Stop loading before navigation
                router.push(`/auth/${updatedSession?.user.id}/complete-profile`);
                return; // Exit early
            }

            toast({
                title: 'Success',
                description: 'You have logged in successfully.',
                variant: 'success',
            });

            router.push('/home');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'An unexpected error occurred.';

            console.error('Login error:', message, error);

            toast({
                title: 'Login Failed',
                description: message,
                variant: 'destructive',
            });
            setIsSubmittingLogin(false);
        }
    };

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        // Extra validation: If password input is shown, password should not be empty
        if (showPasswordInput && !data.password) {
            setFormError('password', { type: 'manual', message: 'Password is required.' });
            return; // Stop submission
        }
        await handleLogin('credentials', data);
    };

    const handleGoogleLogin = async () => {
        await handleLogin('google');
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    // Calculate combined loading state for buttons etc.
    const isLoading = isCheckingEmail || isSubmittingLogin || rhfIsSubmitting;

    return (
        <AnimatePresence mode='wait'>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className=''>
                <h2 className='text-2xl font-bold text-center '>Welcome back!</h2>
                <p className='my-2 text-sm text-center text-gray-500'>Enter your email below to sign in with your account.</p>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className='mt-5 space-y-6'>
                    <div className='w-full'>
                        <Input
                            id='email'
                            type='email'
                            placeholder='projectharibon@gmail.com'
                            required
                            autoComplete='email'
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Invalid email address',
                                },
                            })}
                            aria-invalid={errors.email ? 'true' : 'false'}
                        />

                        {/* Display email validation error */}
                        {errors.email && <p className='mt-1 text-xs text-red-500'>{errors.email.message}</p>}

                        <div className='flex justify-end'>
                            <a
                                href='/auth/forgot-password'
                                className='text-sm text-blue-400 hover:text-blue-600'>
                                Forgot password?
                            </a>
                        </div>
                    </div>
                    <AnimatePresence mode='wait'>
                        {showPasswordInput && (
                            <motion.div
                                key='passwordInput'
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                transition={{ duration: 0.3 }}>
                                <div className='relative mt-2'>
                                    <Input
                                        id='password'
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        required
                                        placeholder='Password'
                                        autoComplete='current-password'
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 6,
                                                message: 'Password must be at least 6 characters long',
                                            },
                                        })}
                                        aria-invalid={errors.password ? 'true' : 'false'}
                                        className={`w-full pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />

                                    <button
                                        type='button'
                                        onClick={togglePasswordVisibility}
                                        className='absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700'>
                                        {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {errors.password && <p className='mt-1 text-xs text-red-500'>{errors.password.message}</p>}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className='transition-all duration-300 ease-in-out'>
                        <div>
                            <PrismButton
                                type='submit'
                                isLoading={isLoading}
                                label='Sign in'
                                loadingLabel='Signing in...'
                                link={null}
                                style='w-full flex justify-center rounded-md bg-blue-500 text-sm font-semibold text-white hover:bg-blue-400'
                            />
                        </div>
                        <div className='relative flex items-center py-4'>
                            <div className='flex-grow border-t border-gray-300'></div>
                            <span className='mx-4 text-xs text-gray-400'>OR CONTINUE WITH</span>
                            <div className='flex-grow border-t border-gray-300'></div>
                        </div>
                        <Button
                            className='w-full text-black bg-white border hover:bg-slate-200'
                            onClick={handleGoogleLogin}
                            disabled={isLoading}>
                            <Image
                                src='/logo/google.svg'
                                height={20}
                                width={20}
                                alt='Google Logo'
                            />
                            Sign in with Google
                        </Button>
                    </div>
                </form>

                <p className='mt-6 text-sm text-center text-gray-400'>
                    Don&apos;t have an account yet?{' '}
                    <a
                        href='/auth/register'
                        className='text-blue-400 hover:text-blue-300'>
                        Sign up
                    </a>
                </p>
            </motion.div>
        </AnimatePresence>
    );
};
