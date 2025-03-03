import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserServiceLibModule } from '@b-prism/user-service-lib';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [UserServiceLibModule, JwtModule],
    controllers: [UserController],
})
export class UserModule {}
