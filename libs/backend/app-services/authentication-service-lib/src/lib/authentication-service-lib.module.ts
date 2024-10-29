import { Module } from '@nestjs/common';
import { AuthenticationServiceLibService } from './authentication-service-lib.service';
import { PrismaDbLibModule } from '@prisma-db-lib';

@Module({
    controllers: [],
    imports: [PrismaDbLibModule],
    providers: [AuthenticationServiceLibService],
    exports: [AuthenticationServiceLibService],
})
export class AuthenticationServiceLibModule {}
