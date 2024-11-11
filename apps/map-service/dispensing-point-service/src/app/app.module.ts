import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DispensingPointModule } from '../dispensing-point/dispensing-point.module';

@Module({
    imports: [DispensingPointModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
