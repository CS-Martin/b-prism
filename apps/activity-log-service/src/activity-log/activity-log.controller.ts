import { ActivityLogServiceLibService } from '@b-prisma/activity-log-service-lib';
import { CreateActivityLogDto } from '@dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Activity Log Endpoints')
@Controller('activity-log')
export class ActivityLogController {
    constructor(private readonly activityLogServiceLibService: ActivityLogServiceLibService) {}

    @Post('create')
    create(@Body() action: string, description: string, user_id: string) {
        return this.activityLogServiceLibService.create(action, description, user_id);
    }

    @Get()
    findAll() {
        return this.activityLogServiceLibService.findAll();
    }
}
