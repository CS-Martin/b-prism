import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseServiceLibModule } from '@b-prism/warehouse-service-lib';

@Module({
    imports: [WarehouseServiceLibModule],
    controllers: [WarehouseController],
})
export class WarehouseModule {}
