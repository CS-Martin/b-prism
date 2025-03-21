import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleServiceLibModule } from '@b-prism/role-service-lib';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [RoleServiceLibModule, JwtModule],
    controllers: [RoleController],
})
export class RoleModule {}
