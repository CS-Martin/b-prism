import { Module } from '@nestjs/common';
import { WarehouseServiceLibService } from './warehouse-service-lib.service';
import { WarehouseMongodbLibModule } from '@b-prism/warehouse-mongodb-lib';
import { ActivityLogServiceLibModule } from '@b-prism/activity-log-service-lib';

@Module({
    imports: [WarehouseMongodbLibModule, ActivityLogServiceLibModule],
    providers: [WarehouseServiceLibService],
    exports: [WarehouseServiceLibService],
})
export class WarehouseServiceLibModule {}
