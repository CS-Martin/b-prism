import { Module } from '@nestjs/common';
import { MailerServiceLibService } from './mailer-service-lib.service';

@Module({
    controllers: [],
    providers: [MailerServiceLibService],
    exports: [MailerServiceLibService],
})
export class MailerServiceLibModule {}
