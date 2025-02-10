import { Module } from '@nestjs/common';
import { MailerServiceLibService } from './mailer-service-lib.service';
import { MailerMongodbLibModule } from '@b-prism/mailer-mongodb-lib';

@Module({
    controllers: [],
    imports: [MailerMongodbLibModule],
    providers: [MailerServiceLibService],
    exports: [MailerServiceLibService],
})
export class MailerServiceLibModule {}
