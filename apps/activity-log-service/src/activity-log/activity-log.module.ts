import { ActivityLogServiceLibModule } from '@b-prism/activity-log-service-lib';
import { Module } from '@nestjs/common';
import { ActivityLogController } from './activity-log.controller';
import { AuthGuard } from 'libs/backend/app-services/guards-service-lib/src/lib/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [ActivityLogServiceLibModule, JwtModule],
    controllers: [ActivityLogController],
})
export class ActivityLogModule {}
