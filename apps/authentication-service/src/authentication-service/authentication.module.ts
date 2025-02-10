import { Module } from '@nestjs/common';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationServiceLibModule } from '@b-prism/authentication-service-lib';

@Module({
    imports: [AuthenticationServiceLibModule],
    controllers: [AuthenticationController],
})
export class AuthenticationModule {}
