import { Module } from '@nestjs/common';
import { RoleMongodbLibService } from './role-mongodb-lib.service';
import { PrismaDbLibModule } from '@prisma-db-lib';

@Module({
    controllers: [],
    imports: [PrismaDbLibModule],
    providers: [RoleMongodbLibService],
    exports: [RoleMongodbLibService],
})
export class RoleMongodbLibModule {}
