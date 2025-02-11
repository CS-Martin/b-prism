import { CreateMailerDto } from '@dto';
import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { Mailer } from '@prisma/client';

@Injectable()
export class MailerMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async upsert(createMailerDto: CreateMailerDto): Promise<Mailer> {
        const mailer = this.prisma.mailer.upsert({
            where: { user_id: createMailerDto.user_id },
            update: { code: createMailerDto.code, expires_at: createMailerDto.expires_at, created_at: new Date() },
            create: { user_id: createMailerDto.user_id, code: createMailerDto.code, expires_at: createMailerDto.expires_at, created_at: new Date() },
        });

        return mailer;
    }

    async verifyEmailCode(user_id: string, code: string): Promise<Mailer | null> {
        const mailer = this.prisma.mailer.findFirst({
            where: { user_id: user_id, code: code },
        });

        return mailer;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.mailer.delete({
            where: {
                id,
            },
        });
    }
}
