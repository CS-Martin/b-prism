import { Module } from '@nestjs/common';
import { RoadNetworkController } from './road-network.controller';
import { RoadNetworkServiceLibModule } from '@b-prism/road-network-service-lib';

@Module({
    imports: [RoadNetworkServiceLibModule],
    controllers: [RoadNetworkController],
})
export class RoadNetworkModule {}
