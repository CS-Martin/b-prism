import { create } from 'zustand';

type AnalyticalDashboardState = {
    selectedRange: string | null;
    setSelectedRange: (range: string | null) => void;
};

export const useAnalyticalDashboardStore = create<AnalyticalDashboardState>((set) => ({
    selectedRange: null,
    setSelectedRange: (range) => set({ selectedRange: range }),
}));
