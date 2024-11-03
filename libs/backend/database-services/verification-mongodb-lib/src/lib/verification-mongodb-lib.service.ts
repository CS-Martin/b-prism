import { UserDto } from '@dto';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';

@Injectable()
export class VerificationMongodbLibService {

    private readonly logger = new Logger(VerificationMongodbLibService.name);

    constructor(private readonly prismaDbLib: PrismaDbLibService) {}

    async verifyUser(user: UserDto): Promise<void> {

        await this.prismaDbLib.user.update({
            where: {
                id: user.id
            },
            data: {
                role: 'verified'
            }
        });

    }

    async unverifyUser(user: UserDto): Promise<void> {

        await this.prismaDbLib.user.update({
            where: {
                id: user.id
            },
            data: {
                role: 'unverified'
            }
        });

    }

    async makeAdmin(user: UserDto): Promise<void> {

        await this.prismaDbLib.user.update({
            where: {
                id: user.id
            },
            data: {
                role: 'admin'
            }
        });

    }
}
