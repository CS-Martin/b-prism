import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
    imports: [ActivityLogModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
