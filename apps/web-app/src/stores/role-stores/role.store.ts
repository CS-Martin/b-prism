import { create } from 'zustand';

interface RoleState {
    name: string;
    description: string;
    setRoleName: (name: string) => void;
    setRoleDescription: (description: string) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
    name: '',
    description: '',

    setRoleName: (name) => set({ name }),
    setRoleDescription: (description) => set({ description }),
}));
