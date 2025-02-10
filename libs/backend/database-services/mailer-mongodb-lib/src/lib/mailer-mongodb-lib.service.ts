import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';

@Injectable()
export class MailerMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}
}
