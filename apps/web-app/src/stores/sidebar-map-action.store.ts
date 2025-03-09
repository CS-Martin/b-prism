import { create } from 'zustand';

type MapActionState = {
    selectedAction: string | null;
    setSelectedAction: (action: string | null) => void;
};

export const useMapActionStore = create<MapActionState>((set) => ({
    selectedAction: null,
    setSelectedAction: (action) => set({ selectedAction: action }),
}));
