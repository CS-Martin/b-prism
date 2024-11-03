import { Module } from '@nestjs/common';
import { UserServiceLibService } from './user-service-lib.service';
import { UserMongodbLibModule } from '@b-prism/user-mongodb-lib';

@Module({
    controllers: [],
    imports: [UserMongodbLibModule],
    providers: [UserServiceLibService],
    exports: [UserServiceLibService],
})
export class UserServiceLibModule {}
