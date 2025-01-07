import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ActivityLogServiceAbstractClass } from './activity-log-service-lib.abstract.class';
import { CreateActivityLogDto, ResponseDto } from '@dto';
import { ActivityLog } from '@prisma/client';

import { ActivityLogMongodbLibService } from '@b-prism/activity-log-mongodb-lib';
import { ActivityLogDto } from '@dto';

@Injectable()
export class ActivityLogServiceLibService implements ActivityLogServiceAbstractClass {
    private readonly logger = new Logger(ActivityLogServiceLibService.name);

    constructor(private readonly activityLogMongodbService: ActivityLogMongodbLibService) {}

    async create(action: string, description: string, author: string): Promise<ResponseDto<ActivityLog>> {
        this.logger.log('Creating activity log', action);
        this.logger.log('Creating activity log', description);
        this.logger.log('Creating activity log', author);

        try {
            const activityLog = await this.activityLogMongodbService.create(action, description, author);

            const response: ResponseDto<ActivityLogDto> = new ResponseDto<ActivityLogDto>(201, this.convertToDto(activityLog));

            return response;
        } catch (error) {
            this.logger.log('Error creating activity log', error);

            throw new BadRequestException(error);
        }
    }

    async findAll(): Promise<ResponseDto<ActivityLogDto[]>> {
        this.logger.log('Finding all activity logs');

        try {
            const activityLogs = await this.activityLogMongodbService.findAll();

            const response: ResponseDto<ActivityLogDto[]> = new ResponseDto<ActivityLogDto[]>(
                200,
                activityLogs.map((activityLog) => this.convertToDto(activityLog)),
            );

            return response;
        } catch (error) {
            this.logger.log('Error finding all activity logs', error);

            throw new BadRequestException(error);
        }
    }

    convertToDto(activityLog: ActivityLog): ActivityLogDto {
        const activityLogDto: ActivityLogDto = new ActivityLogDto();

        activityLogDto.id = activityLog.id ?? '';
        activityLogDto.action = activityLog.action ?? '';
        activityLogDto.description = activityLog.description ?? '';
        activityLogDto.user_id = activityLog.user_id ?? '';
        activityLogDto.created_at = activityLog.created_at ?? new Date();

        return activityLogDto;
    }
}
