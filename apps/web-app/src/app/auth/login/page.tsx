'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Input } from '@b-prism/shadcn-ui/index';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { userService } from 'apps/web-app/src/services/user.service';
import { ResponseDto, UserDto } from '@dto';
import { PrismButton } from 'apps/web-app/src/components/prism-button';
import { useLoginUser } from 'apps/web-app/src/hooks/authentication.hook';

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
            return;
        } else {
            // TODO: check if user has incomplete profile
            // if incomplete, redirect to /auth/new-user
            // if complete, redirect to /home
            // setIsLoading(true);
            // const response = await userService.fetchUserByEmail(data.email);
            // if (response.statusCode !== 201) {
            //     throw new Error('Failed to fetch user');
            // }
            // const user: UserDto = response.body;
            // const isIncompleteProfile = user.id_image_url === undefined || user.id_image_url === null || user.id_image_url === '';
            // if (isIncompleteProfile) {
            // } else {
            //     router.push('/home');
            // }
            // setIsLoading(false);

            const response: ResponseDto<UserDto> = await loginUser(data.email);
            const user: UserDto = response.body;
            const isUserNoValidId: boolean = user.id_image_url === undefined || user.id_image_url === null || user.id_image_url === '';

            if (isUserNoValidId) {
                router.push(`/auth/${user.id}/complete-profile`);
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
                    <h2 className='mt-20 text-center text-2xl/9 font-semibold tracking-tight'>Sign in to your account</h2>
                </div>

                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
                    <form
                        action='#'
                        onSubmit={handleLoginUser}
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
                                isLoading={isLoggingIn}
                                label='Sign in'
                                loadingLabel='Signing in...'
                                link={null}
                                style='flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            />
                        </div>
                    </form>

                    <p className='mt-10 text-center text-sm/6 text-gray-500'>
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
