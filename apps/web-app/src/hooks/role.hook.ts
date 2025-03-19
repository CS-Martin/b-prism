import { ResponseDto, RoleDto } from '@dto';
import { useState } from 'react';
import { roleService } from '../services/role.service';

export const useDisplayRoles = () => {
    const [roles, setRoles] = useState<RoleDto[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const displayRoles = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response: ResponseDto<RoleDto[]> = await roleService.fetchAllRoles();

            setRoles(response.body);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { roles, isLoading, error, displayRoles };
};
