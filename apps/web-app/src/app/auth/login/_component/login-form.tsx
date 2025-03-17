'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import { Button, Input } from '@b-prism/shadcn-ui/index';
import { PrismButton } from 'apps/web-app/src/components/prism-button';
import Image from 'next/image';
import { authService } from '../../../../services/authentication.service';
import { debounce } from 'lodash';
import { Eye, EyeOff } from 'lucide-react';

export const LoginForm = () => {
    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // // Fetch user based on email in searchParams
    useEffect(() => {
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

        if (isValidEmail) {
            const handleDebouncedFetch = debounce(async () => {
                try {
                    const user = await authService.findUserByEmailWithoutThrow(formData.email);
                    setShowPasswordInput(Boolean(user));
                } catch (err) {
                    console.error('Error fetching user:', err);
                }
            }, 1000);

            handleDebouncedFetch();

            return () => handleDebouncedFetch.cancel();
        } else {
            setShowPasswordInput(false); // Hide password input if email is invalid
        }
    }, [formData.email]);

    const handleLogin = async (provider: 'credentials' | 'google', credentials?: { email: string; password: string }) => {
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn(provider, {
                redirect: false,
                ...(provider === 'credentials' && credentials),
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            const updatedSession = await getSession();

            if (!updatedSession?.user?.id_image_url || updatedSession.user.id_image_url === '') {
                router.push(`/auth/${updatedSession?.user.id}/complete-profile`);
                return;
            }

            toast({
                title: 'Success',
                description: 'You have logged in successfully.',
                variant: 'success',
            });

            setIsLoading(false);
            router.push('/home');
        } catch (error) {
            console.error('Login error:', error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred.');
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'An unexpected error occurred.',
                variant: 'destructive',
            });
            setIsLoading(false);
        }
    };

    const handleLoginUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await handleLogin('credentials', { email: formData.email, password: formData.password });
    };

    const handleGoogleLogin = async () => {
        await handleLogin('google');
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

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
                    onSubmit={handleLoginUser}
                    className='mt-5 space-y-6'>
                    <div className='w-full'>
                        <Input
                            id='email'
                            name='email'
                            type='email'
                            placeholder='projectharibon@gmail.com'
                            required
                            autoComplete='email'
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className=''
                        />
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
                                        name='password'
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        required
                                        placeholder='Password'
                                        autoComplete='current-password'
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className='w-full pr-10'
                                    />
                                    <button
                                        type='button'
                                        onClick={togglePasswordVisibility}
                                        className='absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 hover:text-gray-700'>
                                        {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
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
