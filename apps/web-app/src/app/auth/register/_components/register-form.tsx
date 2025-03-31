'use client';

import { useState, useMemo } from 'react'; // Import useMemo
import { useRouter } from 'next/navigation';
import { Button, Input } from '@b-prism/shadcn-ui/index';
import { PrismButton } from 'apps/web-app/src/components/prism-button';
import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { authService } from 'apps/web-app/src/services/authentication.service';
import { ErrorMessage } from 'apps/web-app/src/components/forms/error-message';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'; // Import eye icons
import { CreateUserDto } from '@dto';
import { useTheme } from 'next-themes';
import Link from 'next/link';

const registerSchema = z.object({
    given_name: z.string().min(1, 'Given name is required'),
    family_name: z.string().min(1, 'Family name is required'),
    email: z.string().email('Invalid email address').min(1, 'Email is required'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    role: z.string().default('Default'),
    provider: z.enum(['credentials', 'google']).default('credentials'),
    created_at: z.date().default(() => new Date()),
    updated_at: z.date().default(() => new Date()),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

// --- Helper for Detailed Password Validation Rules ---

const passwordValidationRules = [
    { check: (val: string) => val.length >= 8, message: 'At least 8 characters long' },
    { check: (val: string) => /[A-Z]/.test(val), message: 'At least one uppercase letter' },
    { check: (val: string) => /[a-z]/.test(val), message: 'At least one lowercase letter' },
    { check: (val: string) => /[0-9]/.test(val), message: 'At least one number' },
    { check: (val: string) => /[!@#$%^&*(),.?":{}|<>]/.test(val), message: 'At least one special character (!@#$...)' },
];

// Function to get *all* failed messages for a given password value
const getPasswordValidationErrors = (password: string | undefined | null): string[] => {
    if (!password) return []; // Return empty if no password
    const errors: string[] = [];
    for (const rule of passwordValidationRules) {
        if (!rule.check(password)) {
            errors.push(rule.message);
        }
    }
    return errors;
};

export default function RegisterPage() {
    const { setTheme } = useTheme();
    setTheme('light');

    const router = useRouter();

    // --- State Management ---

    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State for password visibility

    // --- Form Management ---

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, touchedFields, isSubmitting: rhfIsSubmitting },
        setError: setFormError,
    } = useForm<RegisterFormInputs>({
        resolver: zodResolver(registerSchema),
        mode: 'onChange',
        defaultValues: {
            given_name: '',
            family_name: '',
            email: '',
            role: 'Default',
            provider: 'credentials',
        },
    });

    const watchedPassword = watch('password');

    const detailedPasswordErrors = useMemo(() => {
        if (touchedFields.password || errors.password) {
            return getPasswordValidationErrors(watchedPassword);
        }
        return [];
    }, [watchedPassword, errors.password, touchedFields.password]);

    // --- Handlers ---

    const handleRegister: SubmitHandler<RegisterFormInputs> = async (user: CreateUserDto) => {
        setIsRegistering(true);
        try {
            const dataToSend = {
                ...user,
            };

            await authService.create(dataToSend);

            router.push('/auth/login');

            toast({
                title: 'You have successfully registered!',
                description: 'Please login to continue.',
                variant: 'success',
            });
        } catch (error: any) {
            console.error('Error during registration:', error);

            const description = error?.response?.data?.message || 'An unexpected error occurred. Please try again.'; // Try to get server error

            toast({
                title: 'Registration failed',
                description: description,
                variant: 'destructive',
            });

            if (error?.response?.data?.field === 'email') {
                setFormError('email', { type: 'server', message: description });
            }
        } finally {
            setIsRegistering(false);
        }
    };

    const isLoading = isRegistering || rhfIsSubmitting;

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <>
            <div className='flex flex-col justify-center flex-1 min-h-full'>
                <div className='mt-7 md:mt-0'>
                    <div className='mb-1 border rounded-md w-fit'>
                        <Button
                            className='p-3'
                            variant='ghost'
                            onClick={() => router.back()}>
                            <ArrowLeft size={18} />
                        </Button>
                    </div>
                    <h2 className='font-semibold tracking-tight text-2xl/9'>Create an account</h2>
                    <p className='text-sm text-gray-500 '>Please fill in the details below.</p>
                </div>

                <div className='mt-7'>
                    <form
                        noValidate
                        className='mb-5 space-y-6'
                        onSubmit={handleSubmit(handleRegister)}>
                        {' '}
                        <div className='flex flex-col gap-4 sm:flex-row'>
                            {' '}
                            <div className='flex-1'>
                                {' '}
                                <label
                                    htmlFor='given_name'
                                    className='block font-medium text-sm/6'>
                                    Given Name <span className='text-red-500'>*</span>
                                </label>
                                <div className='mt-2'>
                                    <Input
                                        id='given_name'
                                        type='text'
                                        autoComplete='given-name'
                                        {...register('given_name')}
                                        aria-invalid={errors.given_name ? 'true' : 'false'}
                                        className={errors.given_name ? 'border-red-500' : ''}
                                    />

                                    <ErrorMessage message={errors.given_name?.message} />
                                </div>
                            </div>
                            <div className='flex-1'>
                                <label
                                    htmlFor='family_name'
                                    className='block font-medium text-sm/6'>
                                    Family Name <span className='text-red-500'>*</span>
                                </label>
                                <div className='mt-2'>
                                    <Input
                                        id='family_name'
                                        type='text'
                                        autoComplete='family-name'
                                        {...register('family_name')}
                                        aria-invalid={errors.family_name ? 'true' : 'false'}
                                        className={errors.family_name ? 'border-red-500' : ''}
                                    />

                                    <ErrorMessage message={errors.family_name?.message} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor='email'
                                className='block font-medium text-sm/6'>
                                Email address <span className='text-red-500'>*</span>
                            </label>
                            <div className='mt-2'>
                                <Input
                                    id='email'
                                    type='email'
                                    autoComplete='email'
                                    {...register('email')}
                                    aria-invalid={errors.email ? 'true' : 'false'}
                                    className={errors.email ? 'border-red-500' : ''}
                                />

                                <ErrorMessage message={errors.email?.message} />
                            </div>
                        </div>
                        <div>
                            <div className='flex items-center justify-between'>
                                <label
                                    htmlFor='password'
                                    className='block font-medium text-sm/6'>
                                    Password <span className='text-red-500'>*</span>
                                </label>
                            </div>
                            <div className='relative mt-2'>
                                <Input
                                    id='password'
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    autoComplete='new-password'
                                    {...register('password')}
                                    aria-invalid={errors.password ? 'true' : 'false'}
                                    className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                                />
                                <button
                                    type='button'
                                    onClick={togglePasswordVisibility}
                                    className='absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700'
                                    aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}>
                                    {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            {detailedPasswordErrors.length > 0 && <ErrorMessage message={detailedPasswordErrors} />}
                        </div>
                        <div>
                            <PrismButton
                                type='submit'
                                isLoading={isLoading}
                                label='Create account'
                                loadingLabel='Creating your account...'
                                link={null}
                                style='flex w-full justify-center rounded-md bg-blue-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            />
                        </div>
                    </form>

                    <span className='text-xs text-gray-600 '>
                        By creating an account, you agree to the{' '}
                        <a
                            href='#'
                            className='text-blue-500 underline hover:text-blue-600'>
                            Terms of Services
                        </a>{' '}
                        For more information about Haribon&apos;s privacy practices, see the{' '}
                        <a
                            href='#'
                            className='text-blue-500 underline hover:text-blue-600'>
                            Haribon&apos; Privacy Statement
                        </a>{' '}
                        . We&apos;ll occasionally send you account-related emails.
                    </span>

                    <div className='p-3 mt-3 border rounded-md'>
                        <p className='text-center text-sm/6'>
                            {' '}
                            Already have an account?{' '}
                            <a
                                href='/auth/login'
                                className='font-semibold text-blue-500 hover:text-blue-400'>
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
