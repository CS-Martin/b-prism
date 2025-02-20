import { Module } from '@nestjs/common';
import { RoadNetworkServiceLibService } from './road-network-service-lib.service';
import { RoadNetworkMongodbLibModule } from '@b-prism/road-network-mongodb-lib';
import { ActivityLogServiceLibModule } from '@b-prism/activity-log-service-lib';

@Module({
    controllers: [],
    imports: [RoadNetworkMongodbLibModule, ActivityLogServiceLibModule],
    providers: [RoadNetworkServiceLibService],
    exports: [RoadNetworkServiceLibService],
})
export class RoadNetworkServiceLibModule {}
