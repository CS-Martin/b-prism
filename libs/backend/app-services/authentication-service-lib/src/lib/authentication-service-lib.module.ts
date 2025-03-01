import { Module } from '@nestjs/common';
import { AuthenticationServiceLibService } from './authentication-service-lib.service';
import { AuthenticationMongodbLibModule } from '@b-prism/authentication-mongodb-lib';
import { UserServiceLibModule } from '@b-prism/user-service-lib';
import { ActivityLogServiceLibModule } from '@b-prism/activity-log-service-lib';
import { MailerMongodbLibModule } from '@b-prism/mailer-mongodb-lib';
import { MailerServiceLibModule } from '@b-prism/mailer-service-lib';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    controllers: [],
    imports: [
        AuthenticationMongodbLibModule,
        UserServiceLibModule,
        ActivityLogServiceLibModule,
        MailerMongodbLibModule,
        MailerServiceLibModule,
        PassportModule,
        JwtModule.register({
            global: true,
            secret: process.env['JWT_SECRET'],
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [AuthenticationServiceLibService],
    exports: [AuthenticationServiceLibService],
})
export class AuthenticationServiceLibModule {}
