import { Module } from '@nestjs/common';
import { RoadNetworkMongodbLibService } from './road-network-mongodb-lib.service';

@Module({
    controllers: [],
    providers: [RoadNetworkMongodbLibService],
    exports: [RoadNetworkMongodbLibService],
})
export class RoadNetworkMongodbLibModule {}
