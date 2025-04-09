import { Module } from '@nestjs/common';
import { RescuePostServiceLibService } from './rescue-post-service-lib.service';
import { RescuePostMongodbLibModule } from '@b-prism/rescue-post-mongodb-lib';
import { ActivityLogServiceLibModule } from '@b-prism/activity-log-service-lib';

@Module({
    controllers: [],
    imports: [RescuePostMongodbLibModule, ActivityLogServiceLibModule],
    providers: [RescuePostServiceLibService],
    exports: [RescuePostServiceLibService],
})
export class RescuePostServiceLibModule {}
