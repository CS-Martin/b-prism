import { Module } from '@nestjs/common';
import { RoadNetworkController } from './road-network.controller';
import { RoadNetworkServiceLibModule } from '@b-prism/road-network-service-lib';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [RoadNetworkServiceLibModule, JwtModule],
    controllers: [RoadNetworkController],
})
export class RoadNetworkModule {}
