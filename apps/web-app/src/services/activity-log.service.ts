import { ActivityLogDto, CreateActivityLogDto, ResponseDto } from '@dto';
import { BadRequestException } from '@nestjs/common';

class ActivityLogService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_ACTIVITY_LOG_SERVICE_API_PORT}/${process.env.NEXT_PUBLIC_API_VERSION}`;
    }

    public async create(createActivityLogDto: CreateActivityLogDto): Promise<ActivityLogDto> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/activity-logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createActivityLogDto),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException(`Failed to create activity log for ${createActivityLogDto}`);
        }
    }

    public async findAllActivityLogs(access_token?: string): Promise<ResponseDto<ActivityLogDto[]>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/activity-logs`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return await response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to fetch all activity logs');
        }
    }
}

export const activityLogService = new ActivityLogService();
