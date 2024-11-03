import { Module } from '@nestjs/common';
import { AuthenticationServiceLibService } from './authentication-service-lib.service';
import { AuthenticationMongodbLibModule } from '@authentication-mongodb-lib';
import { AuthenticationService } from './authentication-service.abstract.class';
import { UserServiceLibModule } from '@b-prism/user-service-lib';

@Module({
    controllers: [],
    imports: [AuthenticationMongodbLibModule, UserServiceLibModule],
    providers: [AuthenticationServiceLibService],
    exports: [AuthenticationServiceLibService],
})
export class AuthenticationServiceLibModule {}
