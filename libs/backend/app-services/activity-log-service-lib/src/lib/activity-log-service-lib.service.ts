import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ActivityLogServiceAbstractClass } from './activity-log-service-lib.abstract.class';
import { ActivityLogDto, CreateActivityLogDto, ResponseDto } from '@dto';
import { ActivityLog } from '@prisma/client';

import { ActivityLogMongodbLibService } from '@b-prism/activity-log-mongodb-lib';

@Injectable()
export class ActivityLogServiceLibService implements ActivityLogServiceAbstractClass {
    private readonly logger = new Logger(ActivityLogServiceLibService.name);

    constructor(private readonly activityLogMongodbService: ActivityLogMongodbLibService) {}

    async create(data: CreateActivityLogDto): Promise<ResponseDto<ActivityLog>> {
        this.logger.log('Creating activity log', data);

        try {
            const activityLog = await this.activityLogMongodbService.create(data);

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
        activityLogDto.resource = activityLog.resource ?? '';
        activityLogDto.resource_id = activityLog.resource ?? '';
        activityLogDto.author = activityLog.author ?? '';
        activityLogDto.timestamp = activityLog.timestamp ?? new Date();

        return activityLogDto;
    }
}
