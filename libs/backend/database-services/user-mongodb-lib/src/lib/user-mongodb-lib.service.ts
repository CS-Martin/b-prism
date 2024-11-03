import { UserDto } from '@dto';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';

@Injectable()
export class UserMongodbLibService {
    private readonly logger = new Logger(UserMongodbLibService.name);

    constructor(private readonly prisma: PrismaDbLibService) {}

    async findAll(): Promise<UserDto[]> {
        this.logger.log('Finding all users');

        const users: UserDto[] = await this.prisma.user.findMany();

        return users;
    }

    async findById(id: string): Promise<UserDto | null> {
        this.logger.log('Finding user', id);

        const user: UserDto | null = await this.prisma.user.findUnique({
            where: {
                id: id
            }
        });

        return user;
    }

    async findByEmail(email: string): Promise<UserDto | null> {
        this.logger.log('Finding user', email);

        const user: UserDto | null = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        });

        return user;
    }
}
