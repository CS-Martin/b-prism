import { ActivityLogServiceLibService } from '@b-prism/activity-log-service-lib';
import { CreateActivityLogDto } from '@dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Activity Log Endpoints')
@Controller('activity-log')
export class ActivityLogController {
    constructor(private readonly activityLogServiceLibService: ActivityLogServiceLibService) {}

    @Post('create')
    create(@Body() data: CreateActivityLogDto) {
        return this.activityLogServiceLibService.create(data);
    }

    @Get()
    findAll() {
        return this.activityLogServiceLibService.findAll();
    }
}
