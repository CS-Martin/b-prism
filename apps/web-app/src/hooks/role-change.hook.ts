import { useState } from 'react';
import { roleChangeService } from '../services/role-change.service';
import { UserRole } from '@b-prism/enums';
import { VerificationDto } from '@dto';

export const useRoleChange = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const roleChange = async (id: string, newRole: UserRole, accessToken: string) => {
        try {
            setIsLoading(true);

            const verificationDto: VerificationDto = {
                userId: id,
                role: newRole,
            };
            await roleChangeService.changeRole(verificationDto, accessToken);

            return true;
        } catch (error) {
            console.error('Error changing role:', error);

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { roleChange, isLoading };
};
