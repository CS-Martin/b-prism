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

export const useFetchRoleById = () => {
    const [role, setRole] = useState<RoleDto>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRoleById = async (roleId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response: RoleDto = await roleService.fetchRoleById(roleId);
            console.log(response);

            setRole(response);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return { role, isLoading, error, fetchRoleById };
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

export const useUpdateRole = () => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateRole = async (id: string, createRoleDto: CreateRoleDto, author: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await roleService.update(id, createRoleDto, author);

            toast({
                title: 'Role updated successfully!',
                description: `You have successfully updated role ${createRoleDto.name}.`,
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

    return { isLoading, error, updateRole };
};
