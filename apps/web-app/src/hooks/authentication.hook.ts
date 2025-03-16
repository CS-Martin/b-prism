import { useState } from 'react';
import { authService } from '../services/authentication.service';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { find } from 'rxjs';
import { LoginProvider } from '@b-prism/types';

export const useVerifyEmailCode = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const verifyEmailCode = async (email: string, code: string) => {
        setIsLoading(true);

        try {
            const response = await authService.verifyEmailCode(email, code);

            if (response.body === true) {
                toast({
                    title: 'Code matched!',
                    description: 'Please proceed to change your password.',
                    variant: 'success',
                });
            }

            setIsLoading(false);

            return response;
        } catch (error) {
            setIsLoading(false);

            throw error;
        }
    };

    return { verifyEmailCode, isLoading };
};

export const useResetPassword = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const resetPassword = async (email: string, password: string, confirmPassword: string) => {
        setIsLoading(true);

        try {
            const response = await authService.resetPassword(email, { password, confirmPassword });

            setIsLoading(false);

            if (response.statusCode === 201) {
                toast({
                    title: 'Reset Password Succesful!',
                    description: 'You have successfuly reset your password. Please proceed to continue.',
                    variant: 'success',
                });
            }

            return response;
        } catch (error) {
            setIsLoading(false);

            throw error;
        }
    };

    return { resetPassword, isLoading };
};

export const useFindByEmailAndProvider = () => {
    const { toast } = useToast();

    const findByEmailAndProvider = async (provider: LoginProvider, email: string) => {
        const isUserExisting = await authService.findByEmailAndProvider(provider, email);

        if (!isUserExisting) {
            toast({
                title: 'Account already exsists!',
                description: 'Please try logging in with your email and password.',
                variant: 'destructive',
            });

            return false;
        }

        return true;
    };

    return { findByEmailAndProvider };
};
