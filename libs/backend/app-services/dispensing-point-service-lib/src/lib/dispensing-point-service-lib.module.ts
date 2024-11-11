import { Module } from '@nestjs/common';
import { DispensingPointServiceLibService } from './dispensing-point-service-lib.service';
import { DispensingPointMongodbLibModule } from '@b-prism/dispensing-point-mongodb-lib';

@Module({
    controllers: [],
    imports: [DispensingPointMongodbLibModule],
    providers: [DispensingPointServiceLibService],
    exports: [DispensingPointServiceLibService],
})
export class DispensingPointServiceLibModule {}
