import { UserDto, UpdateUserDto } from '@dto';
import { create } from 'zustand';
import { userService } from '../../services/user.service';

interface UserStore {
    users: UserDto[];
    isLoading: boolean;
    error: string | null;

    fetchAllUsers: (token: string) => Promise<void>;
    changeUserRole: (user: UserDto, newRole: string, author: string, token: string) => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
    users: [],
    isLoading: false,
    error: null,

    fetchAllUsers: async (token: string) => {
        set({ isLoading: true, error: null });

        try {
            const users: UserDto[] = await userService.fetchAllUsers(token);
            set({ users: users });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    changeUserRole: async (user: UserDto, newRole: string, author: string, token: string) => {
        set({ isLoading: true, error: null });

        try {
            await userService.update(user.id, newRole, author, token);

            // Update user inside users array
            set((state) => ({
                users: state.users.map((u: UserDto) => (u.id === user.id ? { ...u, role: newRole } : u)),
            }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));
