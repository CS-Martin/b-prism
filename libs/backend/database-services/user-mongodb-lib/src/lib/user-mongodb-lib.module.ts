import { Module } from '@nestjs/common';
import { UserMongodbLibService } from './user-mongodb-lib.service';
import { PrismaDbLibModule } from '@prisma-db-lib';

@Module({
    controllers: [],
    imports: [PrismaDbLibModule],
    providers: [UserMongodbLibService],
    exports: [UserMongodbLibService],
})
export class UserMongodbLibModule {}
