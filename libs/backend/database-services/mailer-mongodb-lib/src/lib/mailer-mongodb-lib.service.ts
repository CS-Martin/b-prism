import { CreateMailerDto } from '@dto';
import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { Mailer } from '@prisma/client';

@Injectable()
export class MailerMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async create(createMailerDto: CreateMailerDto): Promise<Mailer> {
        const mailer = this.prisma.mailer.create({
            data: {
                ...createMailerDto,
            },
        });

        return mailer;
    }

    async delete(id: string): Promise<void> {
        this.prisma.mailer.delete({
            where: {
                id,
            },
        });
    }
}
