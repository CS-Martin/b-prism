import { create } from 'zustand';

import { CreateRoleDto, ResponseDto, RoleDto, UpdateRoleDto } from '@dto';
import { roleService } from '../../services/role.service';
import { toast } from '@b-prism/shadcn-ui/hooks/use-toast';
import { parseErrorMessage } from 'libs/utils/src/lib/error-handler';

interface RoleStore {
    roles: RoleDto[];
    role: RoleDto | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    displayRoles: (token: string) => Promise<void>;
    fetchRoleById: (roleId: string, token: string | undefined) => Promise<void>;
    createRole: (createRoleDto: CreateRoleDto, token: string) => Promise<void>;
    updateRole: (id: string, updateRoleDto: UpdateRoleDto, author: string, token: string) => Promise<void>;
    deleteRole: (role: RoleDto, author: string, token: string) => Promise<void>;
}

export const useRoleStore = create<RoleStore>((set, get) => ({
    roles: [],
    role: null,
    isLoading: false,
    error: null,

    displayRoles: async (token: string) => {
        set({ isLoading: true, error: null });

        try {
            const response: ResponseDto<RoleDto[]> = await roleService.fetchAllRoles(token);
            set({ roles: response.body });
        } catch (error: unknown) {
            parseErrorMessage(error);
        } finally {
            set({ isLoading: false });
        }
    },

    fetchRoleById: async (roleId: string, token: string | undefined) => {
        set({ isLoading: true, error: null });

        try {
            const response: RoleDto = await roleService.fetchRoleById(roleId, token);
            set({ role: response });
        } catch (error: unknown) {
            parseErrorMessage(error);
        } finally {
            set({ isLoading: false });
        }
    },

    createRole: async (createRoleDto: CreateRoleDto, token: string) => {
        set({ isLoading: true, error: null });

        try {
            const newRole: RoleDto = await roleService.create(createRoleDto, token);

            // Insert the created role into role[]
            set((state) => ({
                roles: [newRole, ...state.roles],
                isLoading: false,
                error: null,
            }));

            toast({
                title: 'Role created successfully!',
                description: `You have successfully created role ${createRoleDto.name}.`,
                variant: 'success',
            });
        } catch (error: unknown) {
            parseErrorMessage(error);
        } finally {
            set({ isLoading: false });
        }
    },

    updateRole: async (id: string, updateRoleDto: UpdateRoleDto, author: string, token: string) => {
        set({ isLoading: true, error: null });

        try {
            const updatedRole = await roleService.update(id, updateRoleDto, author, token);

            set((state) => ({
                roles: state.roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)),
                isLoading: false,
                error: null,
            }));

            toast({
                title: 'Role updated successfully!',
                description: `You have successfully updated role ${updateRoleDto.name}.`,
                variant: 'success',
            });
        } catch (error: unknown) {
            parseErrorMessage(error);
        } finally {
            set({ isLoading: false });
        }
    },

    deleteRole: async (role: RoleDto, author: string, token: string) => {
        set({ isLoading: true, error: null });

        try {
            await roleService.delete(role.id, author, token);

            toast({
                title: 'Role deleted successfully!',
                description: `You have successfully deleted role ${role.name}.`,
                variant: 'success',
            });

            set((state) => ({
                roles: state.roles.filter((r) => r.id !== role.id),
            }));
        } catch (error: unknown) {
            parseErrorMessage(error);
        } finally {
            set({ isLoading: false });
        }
    },
}));
