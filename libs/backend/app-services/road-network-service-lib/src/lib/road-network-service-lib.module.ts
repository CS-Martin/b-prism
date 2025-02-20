import { Module } from '@nestjs/common';
import { RoadNetworkServiceLibService } from './road-network-service-lib.service';

@Module({
    controllers: [],
    providers: [RoadNetworkServiceLibService],
    exports: [RoadNetworkServiceLibService],
})
export class RoadNetworkServiceLibModule {}
