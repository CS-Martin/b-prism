import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaDbLibService } from '@prisma-db-lib';

@Injectable()
export class AuthenticationServiceLibService {
    private readonly logger = new Logger(AuthenticationServiceLibService.name);

    constructor(private readonly prisma: PrismaDbLibService) {}

    async findAll() {
        this.logger.log('Finding all users');


        try {
            const userCount = await this.prisma.user.findMany();
            this.logger.log(`Found ${userCount.length} users`);
            return userCount;
        } catch (error) {
            this.logger.error('Error finding users', error);
            throw error;
        }
    }
}
