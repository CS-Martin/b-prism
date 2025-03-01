import { RescuePostDto, ResponseDto } from '@dto';
import { useEffect, useState } from 'react';
import { rescuePostService } from '../services/rescue-post.service';

export const useDisplayRescuePosts = () => {
    const [rescuePosts, setRescuePosts] = useState<RescuePostDto[]>([]);

    const fetchAllRescuePosts = async () => {
        const response: ResponseDto<RescuePostDto[]> = await rescuePostService.findAll();

        if (response.statusCode !== 200) {
            throw new Error('Failed to fetch rescue posts');
        }

        setRescuePosts(response.body);
    };

    useEffect(() => {
        fetchAllRescuePosts();
    }, []);

    return { rescuePosts };
};
