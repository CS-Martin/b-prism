import { Module } from '@nestjs/common';
import { RescuePostServiceLibService } from './rescue-post-service-lib.service';
import { RescuePostMongodbLibModule } from '@b-prism/rescue-post-mongodb-lib';

@Module({
    controllers: [],
    imports: [RescuePostMongodbLibModule],
    providers: [RescuePostServiceLibService],
    exports: [RescuePostServiceLibService],
})
export class RescuePostServiceLibModule {}
