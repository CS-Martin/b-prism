import { Module } from '@nestjs/common';
import { ActivityLogServiceLibService } from './activity-log-service-lib.service';

@Module({
    controllers: [],
    providers: [ActivityLogServiceLibService],
    exports: [ActivityLogServiceLibService],
})
export class ActivityLogServiceLibModule {}
