import { RefObject } from 'react';
import { MapRef } from 'react-map-gl';
import { create } from 'zustand';

interface MapStore {
    isMapLoaded: boolean;
    mapRef: RefObject<MapRef> | null;
    setIsMapLoaded: (loaded: boolean) => void;
    setMapRef: (ref: RefObject<MapRef>) => void;
}

export const useMapStore = create<MapStore>((set) => ({
    isMapLoaded: false,
    mapRef: null,

    setMapRef: (ref) => set({ mapRef: ref }),
    setIsMapLoaded: (loaded: boolean) => set({ isMapLoaded: loaded }),
}));
