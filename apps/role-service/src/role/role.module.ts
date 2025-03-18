import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleServiceLibModule } from '@b-prism/role-service-lib';

@Module({
    imports: [RoleServiceLibModule],
    controllers: [RoleController],
})
export class RoleModule {}
