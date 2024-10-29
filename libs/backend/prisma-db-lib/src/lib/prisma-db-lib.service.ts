import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaDbLibService extends PrismaClient implements OnModuleInit {

    private readonly logger = new Logger(PrismaDbLibService.name);

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Connected to database');
        } catch (error) {
            this.logger.error('Error connecting to database', error);
        }
    }

}
