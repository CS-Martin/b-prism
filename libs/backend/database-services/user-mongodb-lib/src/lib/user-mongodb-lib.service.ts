import { UserDto } from '@dto';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { User } from '@prisma/client';

@Injectable()
export class UserMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async findAll(): Promise<User[]> {
        const users: User[] = await this.prisma.user.findMany();

        return users;
    }

    async findById(id: string): Promise<User | null> {
        const user: User | null = await this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });

        return user;
    }

    async findByEmail(email: string): Promise<User | null> {
        const user: User | null = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        return user;
    }
}
