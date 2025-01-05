import { Injectable } from '@nestjs/common';
import { ActivityLog } from '@prisma/client';
import { PrismaDbLibService } from '@prisma-db-lib';

@Injectable()
export class ActivityLogMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async create(action: string, description: string, user_id: string): Promise<ActivityLog> {
        const data = { action, description, user_id };

        const activityLog = await this.prisma.activityLog.create({ data });

        return activityLog;
    }

    async findAll(): Promise<ActivityLog[]> {
        const activityLogs = await this.prisma.activityLog.findMany();

        return activityLogs;
    }
}
