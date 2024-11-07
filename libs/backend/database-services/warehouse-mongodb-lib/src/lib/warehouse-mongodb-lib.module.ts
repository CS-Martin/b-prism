import { Module } from '@nestjs/common';
import { WarehouseMongodbLibService } from './warehouse-mongodb-lib.service';
import { PrismaDbLibModule } from '@prisma-db-lib';

@Module({
    imports: [PrismaDbLibModule],
    providers: [WarehouseMongodbLibService],
    exports: [WarehouseMongodbLibService],
})
export class WarehouseMongodbLibModule {}
