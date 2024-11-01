import { Module } from '@nestjs/common';
import { AuthenticationMongodbLibService } from './authentication-mongodb-lib.service';
import { PrismaDbLibModule } from '@prisma-db-lib';

@Module({
    controllers: [],
    imports: [PrismaDbLibModule],
    providers: [AuthenticationMongodbLibService],
    exports: [AuthenticationMongodbLibService],
})
export class AuthenticationMongodbLibModule {}
