import { RescuePostDto } from '@dto';
import { create } from 'zustand';
import { rescuePostService } from '../../services/rescue-post.service';

interface RescuePostStore {
    rescuePosts: RescuePostDto[];
    isLoading: boolean;
    error: string | null;

    fetchAllRescuePosts: () => Promise<void>;
}

export const useRescuePostStore = create<RescuePostStore>((set, get) => ({
    rescuePosts: [],
    isLoading: false,
    error: null,

    fetchAllRescuePosts: async () => {
        set({ isLoading: true, error: null });

        try {
            const rescuePosts: RescuePostDto[] = await rescuePostService.findAll();
            console.log('Rescue Posts from stores:', rescuePosts);

            set({ rescuePosts: rescuePosts });
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ isLoading: false });
        }
    },
}));
