import { create } from 'zustand';

type AnalyticalDashboardState = {
    selectedRange: string;
    setSelectedRange: (range: string) => void;
};

export const useAnalyticalDashboardStore = create<AnalyticalDashboardState>((set) => ({
    selectedRange: '24h',
    setSelectedRange: (range) => set({ selectedRange: range }),
}));
