import { ActivityLogDto, ResponseDto } from '@dto';
import { useEffect, useState } from 'react';
import { activityLogService } from '../services/activity-log.service';

export const useDisplayActivityLogs = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [logs, setLogs] = useState<ActivityLogDto[]>([]);

    const fetchAllActivityLogs = async () => {
        setIsLoading(true);

        const response: ResponseDto<ActivityLogDto[]> = await activityLogService.findAllActivityLogs();

        if (response.statusCode !== 200) {
            setIsLoading(false);
            throw new Error('Failed to fetch activity logs');
        }

        setIsLoading(false);
        setLogs(response.body);
    };

    useEffect(() => {
        fetchAllActivityLogs();
    }, []);

    return { logs, isLoading, fetchAllActivityLogs };
};
