import { Injectable } from '@nestjs/common';
import { CreateActivityLogDto } from '@dto';
import { ActivityLog } from '@prisma/client';
import { PrismaDbLibService } from '@prisma-db-lib';

@Injectable()
export class ActivityLogMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async create(data: CreateActivityLogDto): Promise<ActivityLog> {
        const activityLog = await this.prisma.activityLog.create({ data });

        return activityLog;
    }

    async findAll(): Promise<ActivityLog[]> {
        const activityLogs = await this.prisma.activityLog.findMany();

        return activityLogs;
    }
}
