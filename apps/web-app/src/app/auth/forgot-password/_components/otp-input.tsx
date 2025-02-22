import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator, Label, Button } from '@b-prism/shadcn-ui/index';
import { MailerDto, ResponseDto } from '@dto';
import { useSendVerificationCode } from 'apps/web-app/src/hooks/mailer.hook';
import { useEffect, useState } from 'react';

interface OTPInputProps {
    email: string;

    mail?: ResponseDto<MailerDto>;
    setMail: React.Dispatch<React.SetStateAction<ResponseDto<MailerDto> | undefined>>;

    otp: string;
    setOtp: React.Dispatch<React.SetStateAction<string>>;
}

export const OTPInput = ({ email, mail, setMail, otp, setOtp }: OTPInputProps) => {
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    const { sendVerificationCode, isLoading } = useSendVerificationCode();

    // Calculate remaining time
    useEffect(() => {
        if (mail?.body.expires_at) {
            const expiryTime = new Date(mail.body.expires_at).getTime();
            const updateCountdown = () => {
                const now = new Date().getTime();
                const remaining = Math.max(0, expiryTime - now); // Prevent negative values
                setTimeLeft(remaining);

                if (remaining === 0) {
                    setMail(undefined);
                }
            };

            updateCountdown(); // Initial call
            const interval = setInterval(updateCountdown, 1000); // Update every second

            return () => clearInterval(interval);
        }
    }, [mail, setMail]);

    // Convert milliseconds to minutes and seconds
    const formatTime = (ms: number | null) => {
        if (ms === null) return '--:--';
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const handleChange = (newOtp: string) => {
        setOtp(newOtp);
    };

    const generateNewCode = async () => {
        try {
            const response: ResponseDto<MailerDto> = await sendVerificationCode(email);
            setOtp('');
            setMail(response);
        } catch (error) {
            console.error(error);
            return;
        }
    };

    return (
        <div className='text-center flex flex-col gap-y-4'>
            <div>
                <Label className='text-gray-400 dark:text-gray-300 '>
                    Enter the code sent to <span className='text-white font-semibold'>{email}</span> to reset your password.
                </Label>
            </div>
            <div className='text-center flex items-center justify-center'>
                <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={handleChange}>
                    <InputOTPGroup>
                        <InputOTPSlot index={0} />
                    </InputOTPGroup>

                    <InputOTPGroup>
                        <InputOTPSlot index={1} />
                    </InputOTPGroup>

                    <InputOTPGroup>
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>

                    <InputOTPSeparator />

                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                    </InputOTPGroup>

                    <InputOTPGroup>
                        <InputOTPSlot index={4} />
                    </InputOTPGroup>

                    <InputOTPGroup>
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
            </div>
            <div className='text-sm gap-2 flex flex-col text-gray-500 dark:text-gray-400'>
                {mail && (
                    <p>
                        Code expires in: <span className='font-semibold text-white'>{formatTime(timeLeft)}</span>
                    </p>
                )}
                <span>
                    Didn&apos;t receive any code?&nbsp;
                    <Button
                        disabled={isLoading}
                        onClick={generateNewCode}
                        variant='ghost'
                        className='text-blue-500 cursor-pointer p-0 hover:bg-transparent'>
                        Resend it.
                    </Button>
                </span>
            </div>
        </div>
    );
};
