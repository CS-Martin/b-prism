import { ActivityLogDto } from '@dto';

class ActivityLogService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_ACTIVITY_LOG_SERVICE_API_PORT ?? ''}`;
    }

    // public async create(log: ActivityLogDto) {}
}
