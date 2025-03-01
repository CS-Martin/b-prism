import { ActivityLogServiceLibService } from '@b-prism/activity-log-service-lib';
import { CreateActivityLogDto } from '@dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'libs/backend/app-services/guards-service-lib/src/lib/jwt-auth.guard';

@ApiTags('Activity Log Endpoints')
@UseGuards(AuthGuard)
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
