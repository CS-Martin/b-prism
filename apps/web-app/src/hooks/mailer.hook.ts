import { MailerDto, ResponseDto } from '@dto';
import { useEffect, useState } from 'react';
import { mailerService } from '../services/mailer.service';

export const useSendVerificationCode = () => {
    const [isLoading, setIsLoading] = useState(false);

    const sendVerificationCode = async (email: string) => {
        setIsLoading(true);
        const response = await mailerService.sendVerificationCode(email);
        setIsLoading(false);
        return response;
    };

    return { sendVerificationCode, isLoading };
};
