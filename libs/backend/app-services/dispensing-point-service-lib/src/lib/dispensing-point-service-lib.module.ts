import { Module } from '@nestjs/common';
import { DispensingPointServiceLibService } from './dispensing-point-service-lib.service';
import { DispensingPointMongodbLibModule } from '@b-prism/dispensing-point-mongodb-lib';
import { ActivityLogServiceLibModule } from '@b-prisma/activity-log-service-lib';
import { UserServiceLibModule } from '@b-prism/user-service-lib';

@Module({
    controllers: [],
    imports: [DispensingPointMongodbLibModule],
    providers: [DispensingPointServiceLibService],
    exports: [DispensingPointServiceLibService],
})
export class DispensingPointServiceLibModule {}
