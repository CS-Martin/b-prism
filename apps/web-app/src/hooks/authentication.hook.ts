import { ResponseDto, UserDto } from '@dto';
import { useEffect, useState } from 'react';
import { userService } from '../services/user.service';
import { authService } from '../services/authentication.service';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';

export const useLoginUser = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const loginUser = async (email: string) => {
        setIsLoading(true);

        try {
            const response: ResponseDto<UserDto> = await userService.fetchUserByEmail(email);

            if (response.statusCode !== 201) {
                console.log('Authentication Hook: Failed to fetch user by email');

                throw new Error('Authentication Hook: Failed to fetch user by email');
            }

            return response;
        } catch (error) {
            setIsLoading(false);

            throw error;
        }
    };

    return { loginUser, isLoading };
};

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
