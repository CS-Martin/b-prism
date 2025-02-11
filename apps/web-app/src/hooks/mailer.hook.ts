import { MailerDto, ResponseDto } from '@dto';
import { useEffect, useState } from 'react';
import { mailerService } from '../services/mailer.service';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';

export const useSendVerificationCode = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const sendVerificationCode = async (email: string) => {
        setIsLoading(true);

        try {
            const response = await mailerService.sendVerificationCode(email);

            setIsLoading(false);

            toast({
                title: 'New code request sent!',
                description: 'You have successfully requested a new code. Please check your email.',
                variant: 'success',
            });

            return response;
        } catch (error) {
            setIsLoading(false);

            throw error; // Ensure the error is propagated
        }
    };

    return { sendVerificationCode, isLoading };
};
