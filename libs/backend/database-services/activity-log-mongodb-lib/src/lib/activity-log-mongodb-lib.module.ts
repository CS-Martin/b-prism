import { Module } from '@nestjs/common';
import { ActivityLogMongodbLibService } from './activity-log-mongodb-lib.service';
import { PrismaDbLibModule } from '@prisma-db-lib';

@Module({
    controllers: [],
    imports: [PrismaDbLibModule],
    providers: [ActivityLogMongodbLibService],
    exports: [ActivityLogMongodbLibService],
})
export class ActivityLogMongodbLibModule {}
