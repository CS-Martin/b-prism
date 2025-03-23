import { Module } from '@nestjs/common';
import { UserServiceLibService } from './user-service-lib.service';
import { UserMongodbLibModule } from '@b-prism/user-mongodb-lib';
import { ActivityLogServiceLibModule } from '@b-prism/activity-log-service-lib';

@Module({
    controllers: [],
    imports: [UserMongodbLibModule, ActivityLogServiceLibModule],
    providers: [UserServiceLibService],
    exports: [UserServiceLibService],
})
export class UserServiceLibModule {}
