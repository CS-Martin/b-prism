import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoadNetworkModule } from '../road-network/road-network.module';

@Module({
    imports: [RoadNetworkModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
