import { Module } from '@nestjs/common';
import { RoleServiceLibService } from './role-service-lib.service';
import { RoleMongodbLibModule } from '@b-prism/role-mongodb-lib';
import { ActivityLogServiceLibModule } from '@b-prism/activity-log-service-lib';

@Module({
    controllers: [],
    imports: [RoleMongodbLibModule, ActivityLogServiceLibModule],
    providers: [RoleServiceLibService],
    exports: [RoleServiceLibService],
})
export class RoleServiceLibModule {}
