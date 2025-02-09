'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/authentication.service';
import { UserRole } from '@prisma/client';
import { Button, Input } from '@b-prism/shadcn-ui/index';
import { PrismButton } from 'apps/web-app/src/components/prism-button';

export default function RegisterPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState({
        given_name: '',
        family_name: '',
        email: '',
        password: '',
        office: '',
        position: '',
        role: UserRole.unverified,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const registerUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        await authService.create(data);

        router.push('/auth/login');
        setIsLoading(false);
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
                    <h2 className='mt-10 text-center text-2xl/9 font-semibold tracking-tight'>Create an account</h2>
                </div>

                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                    <form
                        action='#'
                        method='POST'
                        className='space-y-6'
                        onSubmit={registerUser}>
                        <div className='flex gap-4'>
                            <div>
                                <label
                                    htmlFor='given_name'
                                    className='block text-sm/6 font-medium'>
                                    Given Name
                                </label>
                                <div className='mt-2'>
                                    <Input
                                        id='given_name'
                                        name='given_name'
                                        type='text'
                                        required
                                        value={data.given_name}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                given_name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor='family_name'
                                    className='block text-sm/6 font-medium'>
                                    Family Name
                                </label>
                                <div className='mt-2'>
                                    <Input
                                        id='family_name'
                                        name='family_name'
                                        type='text'
                                        required
                                        value={data.family_name}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                family_name: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-4'>
                            <div>
                                <label
                                    htmlFor='office'
                                    className='block text-sm/6 font-medium'>
                                    Office
                                </label>
                                <div className='mt-2'>
                                    <Input
                                        id='office'
                                        name='office'
                                        type='text'
                                        required
                                        value={data.office}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                office: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor='position'
                                    className='block text-sm/6 font-medium'>
                                    Position
                                </label>
                                <div className='mt-2'>
                                    <Input
                                        id='position'
                                        name='position'
                                        type='text'
                                        required
                                        value={data.position}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                position: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                        </div>

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
                            <PrismButton
                                type='submit'
                                isLoading={isLoading}
                                label='Register'
                                loadingLabel='Creating your account...'
                                link={null}
                                style='flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            />
                        </div>
                    </form>

                    <p className='mt-10 text-center text-sm/6 text-gray-300'>
                        Already have an account?{' '}
                        <a
                            href='/auth/login'
                            className='font-semibold text-blue-500 hover:text-blue-400'>
                            Sign in
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
