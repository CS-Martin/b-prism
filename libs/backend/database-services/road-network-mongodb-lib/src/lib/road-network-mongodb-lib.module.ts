import { Module } from '@nestjs/common';
import { RoadNetworkMongodbLibService } from './road-network-mongodb-lib.service';
import { PrismaDbLibModule } from '@prisma-db-lib';

@Module({
    controllers: [],
    imports: [PrismaDbLibModule],
    providers: [RoadNetworkMongodbLibService],
    exports: [RoadNetworkMongodbLibService],
})
export class RoadNetworkMongodbLibModule {}
