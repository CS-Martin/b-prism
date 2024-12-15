'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Input } from '@b-prism/shadcn-ui/index';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { userService } from 'apps/web-app/src/services/user.service';

export default function LoginPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const loginUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (result?.error) {
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
            });
            return;
        } else {
            // TODO: check if user has incomplete profile
            // if incomplete, redirect to /auth/new-user
            // if complete, redirect to /home

            const response = await userService.fetchUserByEmail(data.email);

            const isIncompleteProfile = response.body.id_image_url === null;

            if (isIncompleteProfile) {
                router.push('/auth/new-user');
            } else {
                router.push('/home');
            }
        }
    };

    return (
        <>
            <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
                <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                    {/* <Image
                        alt="Your Company"
                        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                        className="mx-auto h-10 w-auto"
                    /> */}
                    <h2 className='mt-20 text-center text-2xl/9 font-semibold tracking-tight'>
                        Sign in to your account
                    </h2>
                </div>

                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                    <form
                        action='#'
                        onSubmit={loginUser}
                        className='space-y-6'>
                        <div>
                            <label
                                htmlFor='email'
                                className='block text-sm/6 font-medium'>
                                Email address
                            </label>
                            <div className='mt-2'>
                                <Input
                                    id='email'
                                    name='email'
                                    type='email'
                                    required
                                    autoComplete='email'
                                    className=''
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
                                    className='block text-sm/6 font-medium'>
                                    Password
                                </label>
                                <div className='text-sm'>
                                    <a
                                        href='#'
                                        className='font-semibold text-indigo-600 hover:text-indigo-500'>
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
                            <button
                                type='submit'
                                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
                                Sign in
                            </button>
                        </div>
                    </form>

                    {error && <p className='mt-10 text-center text-sm/6 text-red-500'>{error}</p>}

                    <p className='mt-10 text-center text-sm/6 text-gray-500'>
                        Don&apos;t have an account yet?{' '}
                        <a
                            href='/auth/register'
                            className='font-semibold text-indigo-600 hover:text-indigo-500'>
                            Sign up
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
