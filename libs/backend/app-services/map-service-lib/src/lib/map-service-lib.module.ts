import { Module } from '@nestjs/common';
import { MapServiceLibService } from './map-service-lib.service';

@Module({
    controllers: [],
    providers: [MapServiceLibService],
    exports: [MapServiceLibService],
})
export class MapServiceLibModule {}
