import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RescuePostModule } from '../rescue-post/rescue-post.module';

@Module({
    imports: [RescuePostModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
