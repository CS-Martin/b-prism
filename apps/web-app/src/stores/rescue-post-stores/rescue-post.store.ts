import { RescuePostDto } from '@dto';
import { create } from 'zustand';
import { rescuePostService } from '../../services/rescue-post.service';

interface RescuePostStore {
    rescuePosts: RescuePostDto[];
    isLoading: boolean;
    error: string | null;

    fetchAllRescuePosts: () => Promise<void>;
    updateRescePostStatus: (rescuePostId: string | undefined, status: 'unattended' | 'pending' | 'rescued' | null, author: string, token: string) => Promise<void>;
}

export const useRescuePostStore = create<RescuePostStore>((set, get) => ({
    rescuePosts: [],
    isLoading: false,
    error: null,

    fetchAllRescuePosts: async () => {
        set({ isLoading: true, error: null });

        try {
            const rescuePosts: RescuePostDto[] = await rescuePostService.findAll();

            set({ rescuePosts: rescuePosts });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },

    updateRescePostStatus: async (rescuePostId: string | undefined, status: 'unattended' | 'pending' | 'rescued' | null, author: string, token: string) => {
        set({ isLoading: true, error: null });

        try {
            await rescuePostService.updateRescuePostStatus(rescuePostId, status, author, token);

            const st = status === 'unattended' ? 0 : status === 'pending' ? 1 : 2;

            set((state) => ({
                rescuePosts: state.rescuePosts.map((rescuePost) => (rescuePost.id === rescuePostId ? { ...rescuePost, status: st, updated_at: new Date() } : rescuePost)),
                isLoading: false,
                error: null,
            }));
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));
