import { Module } from '@nestjs/common';
import { MailerMongodbLibService } from './mailer-mongodb-lib.service';

@Module({
    controllers: [],
    providers: [MailerMongodbLibService],
    exports: [MailerMongodbLibService],
})
export class MailerMongodbLibModule {}
