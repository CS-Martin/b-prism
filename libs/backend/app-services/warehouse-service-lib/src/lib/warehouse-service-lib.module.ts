import { Module } from '@nestjs/common';
import { WarehouseServiceLibService } from './warehouse-service-lib.service';
import { WarehouseMongodbLibModule } from '@b-prism/warehouse-mongodb-lib';

@Module({
    imports: [WarehouseMongodbLibModule],
    providers: [WarehouseServiceLibService],
    exports: [WarehouseServiceLibService],
})
export class WarehouseServiceLibModule {}
