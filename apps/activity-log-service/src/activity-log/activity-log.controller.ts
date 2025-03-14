import { ActivityLogServiceLibService } from '@b-prism/activity-log-service-lib';
import { CreateActivityLogDto } from '@dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'libs/backend/app-services/guards-service-lib/src/lib/jwt-auth.guard';

@ApiTags('Activity Log Endpoints')
@UseGuards(AuthGuard)
@Controller(`${new ConfigService().get('API_VERSION')}/activity-logs`)
export class ActivityLogController {
    constructor(private readonly activityLogServiceLibService: ActivityLogServiceLibService) {}

    @Post()
    create(@Body() createActivityLogDto: CreateActivityLogDto) {
        return this.activityLogServiceLibService.create(createActivityLogDto);
    }

    @Get()
    findAll() {
        return this.activityLogServiceLibService.findAll();
    }
}
