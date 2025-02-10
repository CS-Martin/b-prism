import { Module } from '@nestjs/common';
import { MailerMongodbLibService } from './mailer-mongodb-lib.service';
import { PrismaDbLibModule } from '@prisma-db-lib';

@Module({
    controllers: [],
    imports: [PrismaDbLibModule],
    providers: [MailerMongodbLibService],
    exports: [MailerMongodbLibService],
})
export class MailerMongodbLibModule {}
