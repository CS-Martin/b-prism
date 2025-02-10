import { ActivityLogServiceLibModule } from '@b-prism/activity-log-service-lib';
import { Module } from '@nestjs/common';
import { ActivityLogController } from './activity-log.controller';

@Module({
    imports: [ActivityLogServiceLibModule],
    controllers: [ActivityLogController],
})
export class ActivityLogModule {}
