import { ActivityLogDto, CreateActivityLogDto, ResponseDto } from '@dto';
import { BadRequestException } from '@nestjs/common';

class ActivityLogService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_ACTIVITY_LOG_SERVICE_API_PORT ?? ''}`;
    }

    public async create(data: CreateActivityLogDto): Promise<ActivityLogDto> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/activity-log/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException(`Failed to create activity log for ${data}`);
        }
    }

    public async findAllActivityLogs(): Promise<ResponseDto<ActivityLogDto[]>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/activity-log`);

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to fetch all activity logs');
        }
    }
}

export const activityLogService = new ActivityLogService();
