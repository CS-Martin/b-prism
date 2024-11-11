import { Module } from '@nestjs/common';
import { DispensingPointMongodbLibService } from './dispensing-point-mongodb-lib.service';
import { PrismaDbLibModule } from '@prisma-db-lib';

@Module({
    controllers: [],
    imports: [PrismaDbLibModule],
    providers: [DispensingPointMongodbLibService],
    exports: [DispensingPointMongodbLibService],
})
export class DispensingPointMongodbLibModule {}
