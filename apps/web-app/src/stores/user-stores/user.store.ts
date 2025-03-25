import { UserDto, UpdateUserDto } from '@dto';
import { create } from 'zustand';
import { userService } from '../../services/user.service';

interface UserStore {
    users: UserDto[];
    isLoading: boolean;
    error: string | null;

    fetchAllUsers: (token: string) => Promise<void>;
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
}));
