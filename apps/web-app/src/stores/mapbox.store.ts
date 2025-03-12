import { create } from 'zustand';

interface MapStore {
    isMapLoaded: boolean;
    setIsMapLoaded: (loaded: boolean) => void;
}

export const useMapStore = create<MapStore>((set) => ({
    isMapLoaded: false,

    setIsMapLoaded: (loaded: boolean) => set({ isMapLoaded: loaded }),
}));
