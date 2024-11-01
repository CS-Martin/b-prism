import { Module } from '@nestjs/common';
import { AuthenticationServiceLibService } from './authentication-service-lib.service';
import { AuthenticationMongodbLibModule } from '@authentication-mongodb-lib';
import { AuthenticationService } from './authentication-service.abstract.class';

@Module({
    controllers: [],
    imports: [AuthenticationMongodbLibModule],
    providers: [AuthenticationServiceLibService],
    exports: [AuthenticationServiceLibService],
})
export class AuthenticationServiceLibModule {}
