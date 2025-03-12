'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { Input, Label } from '@b-prism/shadcn-ui/index';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ResponseDto, UserDto } from '@dto';
import { PrismButton } from 'apps/web-app/src/components/prism-button';
import { useLoginUser } from 'apps/web-app/src/hooks/authentication.hook';
import Image from 'next/image';
import Link from 'next/link';
import { set } from 'lodash';

export default function LoginPage() {
    const { loginUser, isLoading: isLoggingIn } = useLoginUser();

    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const handleLoginUser = async (event: React.FormEvent<HTMLFormElement>) => {
        setIsLoading(true);
        event.preventDefault();

        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);

            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
            });

            setIsLoading(false);
            return;
        } else {
            toast({
                title: 'Success',
                description: 'You have logged in successfully.',
                variant: 'success',
            });

            setIsLoading(false);

            router.push('/home');
        }
    };

    return (
        <>
            <div className='flex flex-col justify-center flex-1 min-h-full lg:px-8'>
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
            </div>
        </>
    );
}
