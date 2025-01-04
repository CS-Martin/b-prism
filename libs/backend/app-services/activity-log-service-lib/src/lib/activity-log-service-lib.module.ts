import { Module } from '@nestjs/common';
import { ActivityLogServiceLibService } from './activity-log-service-lib.service';
import { ActivityLogMongodbLibModule } from '@b-prism/activity-log-mongodb-lib';

@Module({
    controllers: [],
    imports: [ActivityLogMongodbLibModule],
    providers: [ActivityLogServiceLibService],
    exports: [ActivityLogServiceLibService],
})
export class ActivityLogServiceLibModule {}
