import { Module } from '@nestjs/common';
import { RescuePostMongodbLibService } from './rescue-post-mongodb-lib.service';
import { PrismaDbLibModule } from '@prisma-db-lib';

@Module({
    controllers: [],
    imports: [PrismaDbLibModule],
    providers: [RescuePostMongodbLibService],
    exports: [RescuePostMongodbLibService],
})
export class RescuePostMongodbLibModule {}
