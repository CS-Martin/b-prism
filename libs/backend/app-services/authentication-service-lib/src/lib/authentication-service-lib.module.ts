import { Module } from '@nestjs/common';
import { AuthenticationServiceLibService } from './authentication-service-lib.service';
import { AuthenticationMongodbLibModule } from '@b-prism/authentication-mongodb-lib';
import { UserServiceLibModule } from '@b-prism/user-service-lib';
import { ActivityLogServiceLibModule } from '@b-prisma/activity-log-service-lib';
import { MailerMongodbLibModule } from '@b-prism/mailer-mongodb-lib';

@Module({
    controllers: [],
    imports: [AuthenticationMongodbLibModule, UserServiceLibModule, ActivityLogServiceLibModule, MailerMongodbLibModule],
    providers: [AuthenticationServiceLibService],
    exports: [AuthenticationServiceLibService],
})
export class AuthenticationServiceLibModule {}
