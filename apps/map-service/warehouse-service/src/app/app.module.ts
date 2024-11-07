import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WarehouseModule } from '../warehouse/warehouse.module';

@Module({
    imports: [WarehouseModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
