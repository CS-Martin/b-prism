import { Module } from '@nestjs/common';
import { MailerController } from './mailer.controller';
import { AuthenticationServiceLibModule } from '@b-prism/authentication-service-lib';

@Module({
    imports: [AuthenticationServiceLibModule],
    controllers: [MailerController],
})
export class MailerModule {}
