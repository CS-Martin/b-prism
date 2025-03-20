import { CreateRoleDto, ResponseDto, RoleDto } from '@dto';
import { useState } from 'react';
import { roleService } from '../services/role.service';
import { useToast } from '@b-prism/shadcn-ui/hooks/use-toast';

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

export const useCreateRole = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createRole = async (createRoleDto: CreateRoleDto) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await roleService.create(createRoleDto);

            toast({
                title: 'Role created successfully!',
                description: `You have successfully created role ${createRoleDto.name}.`,
                variant: 'success',
            });
        } catch (error: any) {
            setError(error.message);

            toast({
                title: 'Error',
                description: `Encountered an error: ${error}`,
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, createRole };
};
