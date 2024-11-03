import { Module } from '@nestjs/common';
import { VerificationMongodbLibService } from './verification-mongodb-lib.service';
import { PrismaDbLibModule } from '@prisma-db-lib';

@Module({
    controllers: [],
    imports: [PrismaDbLibModule],
    providers: [VerificationMongodbLibService],
    exports: [VerificationMongodbLibService],
})
export class VerificationMongodbLibModule {}
