import { Module } from '@nestjs/common';
import { WarehouseController } from './warehouse.controller';
import { WarehouseServiceLibModule } from '@b-prism/warehouse-service-lib';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [WarehouseServiceLibModule, JwtModule],
    controllers: [WarehouseController],
})
export class WarehouseModule {}
