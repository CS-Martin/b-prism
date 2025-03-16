'use client';

import { useState } from 'react';
import { getSession, signIn, useSession } from 'next-auth/react';
import { Button, Input, Label } from '@b-prism/shadcn-ui/index';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { PrismButton } from 'apps/web-app/src/components/prism-button';
import Image from 'next/image';
import Link from 'next/link';
import { ParticleBackground } from 'apps/web-app/src/components/particle-background';

export default function LoginPage() {
    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const handleLogin = async (provider: 'credentials' | 'google', credentials?: { email: string; password: string }) => {
        setIsLoading(true);
        setError('');

        try {
            const result = await signIn(provider, {
                redirect: false,
                ...(provider === 'credentials' && credentials),
            });

            if (result?.error) {
                console.log('LOGIN ERROR: ', result.error);
                throw new Error(result.error);
            }

            const updatedSession = await getSession();

            if (!updatedSession?.user?.id_image_url || updatedSession.user.id_image_url === '') {
                // Redirect to complete profile page if id_image_url is missing
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

            // Stay on the login page and show the error
            router.push('/auth/login');
        }
    };

    const handleLoginUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await handleLogin('credentials', { email: data.email, password: data.password });
    };

    const handleGoogleLogin = async () => {
        await handleLogin('google');
    };

    return (
        <div className=''>
            <ParticleBackground />
            {/* <div className='flex flex-col justify-center flex-1 min-h-full lg:px-8'>
                    <div className='flex flex-col items-center sm:mx-auto sm:w-full sm:max-w-sm'>
                        <Link href={'/home'}>
                            <Image
                                alt='Your Company'
                                src='/logo/haribon-logo.svg'
                                height={50}
                                width={50}
                                className='h-32'
                            />
                        </Link>
                        <h2 className='font-semibold tracking-tight text-xl/10'>Sign in to Haribon</h2>
                    </div>

                    <Button
                        className='mt-4'
                        onClick={handleGoogleLogin}
                        disabled={isLoading}>
                        Sign in with Google
                    </Button>

                    <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-xs'>
                        <form
                            action='#'
                            onSubmit={handleLoginUser}
                            className='space-y-6'>
                            <div>
                                <Label
                                    htmlFor='email'
                                    className='block font-medium text-sm/6'>
                                    Email address
                                </Label>
                                <div className='mt-2'>
                                    <Input
                                        id='email'
                                        name='email'
                                        type='email'
                                        required
                                        autoComplete='email'
                                        value={data.email}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <div className='flex items-center justify-between'>
                                    <label
                                        htmlFor='password'
                                        className='block font-medium text-sm/6'>
                                        Password
                                    </label>
                                    <div className='text-sm'>
                                        <a
                                            href='/auth/forgot-password'
                                            className='font-semibold text-blue-500 hover:text-blue-400'>
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>
                                <div className='mt-2'>
                                    <Input
                                        id='password'
                                        name='password'
                                        type='password'
                                        required
                                        autoComplete='current-password'
                                        value={data.password}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                password: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <PrismButton
                                    type='submit'
                                    isLoading={isLoading}
                                    label='Sign in'
                                    loadingLabel='Signing in...'
                                    link={null}
                                    style='flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                />
                            </div>
                        </form>

                        <p className='mt-10 text-center text-gray-500 text-sm/6'>
                            Don&apos;t have an account yet?{' '}
                            <a
                                href='/auth/register'
                                className='font-semibold text-blue-500 hover:text-blue-400'>
                                Sign up
                            </a>
                        </p>
                    </div>
                </div> */}
        </div>
    );
}
