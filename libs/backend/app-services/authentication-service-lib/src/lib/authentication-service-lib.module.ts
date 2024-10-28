import { Module } from '@nestjs/common';
import { AuthenticationServiceLibService } from './authentication-service-lib.service';

@Module({
    controllers: [],
    providers: [AuthenticationServiceLibService],
    exports: [AuthenticationServiceLibService],
})
export class AuthenticationServiceLibModule {}
