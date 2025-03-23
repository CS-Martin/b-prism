'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../../services/authentication.service';
import { Input } from '@b-prism/shadcn-ui/index';
import { PrismButton } from 'apps/web-app/src/components/prism-button';
import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';

export default function RegisterPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState({
        provider: 'credentials',
        given_name: '',
        family_name: '',
        email: '',
        password: '',
        office: '',
        position: '',
        role: '',
        created_at: new Date(),
        updated_at: new Date(),
    });

    const registerUser = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        await authService.create({
            ...data,
            provider: 'credentials',
        });

        router.push('/auth/login');
        setIsLoading(false);

        toast({
            title: 'You have successfully registered!',
            description: 'Please login to continue.',
            variant: 'success',
        });
    };

    return (
        <>
            <div className='flex flex-col justify-center flex-1 min-h-full px-6 py-12 lg:px-8'>
                <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
                    {/* <Image
                        alt="Your Company"
                        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                        className="w-auto h-10 mx-auto"
                    /> */}
                    <h2 className='mt-10 font-semibold tracking-tight text-center text-2xl/9'>Create an account</h2>
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
                                    className='block font-medium text-sm/6'>
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
                                    className='block font-medium text-sm/6'>
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
                                    className='block font-medium text-sm/6'>
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
                                    className='block font-medium text-sm/6'>
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
                                className='block font-medium text-sm/6'>
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
                                    className='block font-medium text-sm/6'>
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

                    <p className='mt-10 text-center text-gray-300 text-sm/6'>
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
