'use client';

import { useState } from 'react';
import { InputEmail } from './_components/input-email';
import { OTPInput } from './_components/otp-input';
import { PasswordInput } from './_components/password-input';
import { Button } from '@b-prism/shadcn-ui/index';
import { ArrowLeft } from 'lucide-react';
import { useSendVerificationCode } from 'apps/web-app/src/hooks/mailer.hook';
import { MailerDto, ResponseDto, UserDto } from '@dto';
import { PacmanLoader } from 'react-spinners';
import { useResetPassword, useVerifyEmailCode } from 'apps/web-app/src/hooks/authentication.hook';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [mail, setMail] = useState<ResponseDto<MailerDto>>();
    const [currentStep, setCurrentStep] = useState(0);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>('');

    const { sendVerificationCode, isLoading: isSendingCode } = useSendVerificationCode();
    const { verifyEmailCode, isLoading: isVerifyingCode } = useVerifyEmailCode();
    const { resetPassword, isLoading: isResettingPassword } = useResetPassword();

    const steps = [
        {
            title: 'Email',
            description: 'Enter your email address.',
            component: (
                <InputEmail
                    email={email}
                    setEmail={setEmail}
                />
            ),
        },
        {
            title: 'OTP',
            description: 'Enter the code sent to your email.',
            component: (
                <OTPInput
                    email={email}
                    mail={mail}
                    setMail={setMail}
                    otp={otp}
                    setOtp={setOtp}
                />
            ),
        },
        {
            title: 'Password',
            description: 'Set a new secure password.',
            component: (
                <PasswordInput
                    password={password}
                    setPassword={setPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                />
            ),
        },
    ];

    const handleNext = async () => {
        // Should reset error before proceeding
        setError(null);

        if (currentStep === 0) {
            if (!email) return setError('Please enter your email.');

            if (!validateEmail(email)) return setError('Please enter a valid email address.');

            try {
                const mailer: ResponseDto<MailerDto> = await sendVerificationCode(email);
                setMail(mailer);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message); // Use the backend error message
                } else {
                    setError('An unknown error occurred while sending the verification code.');
                }
                return;
            }
        }

        if (currentStep === 1) {
            if (otp.length !== 6) return setError('OTP must be 6 digits.');

            try {
                const response: ResponseDto<boolean> = await verifyEmailCode(email, otp);

                if (response.body !== true) {
                    return;
                }
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred while sending the verification code');
                }
                return;
            }
        }

        if (currentStep === 2) {
            if (password.length < 6 || password !== confirmPassword) return;

            try {
                const response: ResponseDto<UserDto> = await resetPassword(email, password, confirmPassword);

                if (response.statusCode !== 200) {
                    throw error;
                }

                router.push('/auth/login');
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred resetting your password.');
                }
                return;
            }
        }

        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handleBack = () => {
        if (currentStep === 0) {
            router.back();
        } else {
            setCurrentStep((prev) => Math.max(prev - 1, 0));
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-h-screen  p-8'>
            <div className='w-full max-w-[600px] bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6'>
                {/* Progress Steps */}
                <div className='flex justify-between items-start relative mb-6 '>
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className='relative flex flex-col items-center w-full'>
                            {/* Connector Line */}
                            {index !== steps.length && (
                                <div
                                    className={`absolute top-5 left-1/2 transform -translate-x-1/2 h-1 w-full rounded-full ${index < currentStep + 1 ? 'bg-green-500' : 'bg-gray-300'}`}
                                />
                            )}

                            {/* Step Circle */}
                            <div
                                className={`z-10 flex items-center justify-center w-11 h-11 rounded-full border-[5px] border-gray-800 ${index <= currentStep ? 'bg-green-500 ' : 'bg-white'}`}>
                                {index < currentStep ? <span className='text-white text-lg font-bold'>✔</span> : <span className='text-gray-700 font-semibold'>{index + 1}</span>}
                            </div>

                            {/* Step Labels */}
                            <div className='mt-3 text-center'>
                                <p className={`text-sm font-semibold ${index <= currentStep ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500'}`}>{step.title}</p>
                                <p className='text-xs text-gray-400 dark:text-gray-300'>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className='mb-4 min-h-fit max-h-[200px] transition-all duration-500'>{steps[currentStep].component}</div>

                {/* Error Message */}
                {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

                {/* Navigation Buttons */}
                <div className='mt-6 flex flex-col items-center gap-y-2 justify-between'>
                    <Button
                        type='submit'
                        onClick={handleNext}
                        className='px-4 w-full py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-400 disabled:opacity-50'
                        disabled={
                            isSendingCode ||
                            isVerifyingCode || // Disable while the request is in progress
                            isResettingPassword ||
                            (currentStep === 0 && !email) ||
                            (currentStep === 1 && otp.length !== 6) ||
                            (currentStep === 2 && (password.length < 6 || password !== confirmPassword))
                        }>
                        {isSendingCode || isVerifyingCode || isResettingPassword ? (
                            <>
                                <PacmanLoader
                                    className='pacman-loader'
                                    color='white'
                                    size={10}
                                />
                            </>
                        ) : currentStep === 2 ? (
                            'Change password'
                        ) : (
                            'Next'
                        )}
                    </Button>
                    <Button
                        variant='ghost'
                        onClick={handleBack}
                        className='px-4 py-2 w-1/6 rounded-lg disabled:opacity-50 hover:bg-transparent'>
                        <ArrowLeft />
                        Back
                    </Button>
                </div>
            </div>
        </div>
    );
}

const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
