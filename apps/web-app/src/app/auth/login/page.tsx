'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Input, Label } from '@b-prism/shadcn-ui/index';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { userService } from 'apps/web-app/src/services/user.service';
import { ResponseDto, UserDto } from '@dto';
import { PrismButton } from 'apps/web-app/src/components/prism-button';
import { useLoginUser } from 'apps/web-app/src/hooks/authentication.hook';
import Image from 'next/image';

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
            const response: ResponseDto<UserDto> = await loginUser(data.email);
            const user: UserDto = response.body;
            const userHasNoValidId: boolean = user.id_image_url === undefined || user.id_image_url === null || user.id_image_url === '';

            if (userHasNoValidId) {
                router.push(`/auth/${user.id}/complete-profile`);
            } else {
                router.push('/home');
            }
        }
    };

    return (
        <>
            <div className='flex min-h-full flex-1 flex-col justify-center lg:px-8'>
                <div className='sm:mx-auto flex flex-col items-center sm:w-full sm:max-w-sm'>
                    <Image
                        alt='Your Company'
                        src='/logo/haribon-logo.svg'
                        height={50}
                        width={50}
                        className='h-32'
                    />
                    <h2 className='text-xl/10 font-semibold tracking-tight'>Sign in to Haribon</h2>
                </div>

                <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-xs'>
                    <form
                        action='#'
                        onSubmit={handleLoginUser}
                        className='space-y-6'>
                        <div>
                            <Label
                                htmlFor='email'
                                className='block text-sm/6 font-medium'>
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
