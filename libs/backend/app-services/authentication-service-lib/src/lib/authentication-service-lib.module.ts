import { Module } from '@nestjs/common';
import { AuthenticationServiceLibService } from './authentication-service-lib.service';
import { AuthenticationMongodbLibModule } from '@authentication-mongodb-lib';
import { UserServiceLibModule } from '@b-prism/user-service-lib';
import { ActivityLogServiceLibModule } from '@b-prisma/activity-log-service-lib';

@Module({
    controllers: [],
    imports: [AuthenticationMongodbLibModule, UserServiceLibModule, ActivityLogServiceLibModule],
    providers: [AuthenticationServiceLibService],
    exports: [AuthenticationServiceLibService],
})
export class AuthenticationServiceLibModule {}
