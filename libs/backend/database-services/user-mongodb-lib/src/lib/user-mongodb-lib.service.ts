import { LoginProvider } from '@b-prism/types';
import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { User } from '@prisma/client';

@Injectable()
export class UserMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async updateRefreshToken(id: string, provider: LoginProvider, hashedRefreshToken: string): Promise<User> {
        const user: User | null = await this.prisma.user.update({
            where: {
                id: id,
                provider: provider,
            },
            data: {
                refresh_token: hashedRefreshToken,
            },
        });

        return user;
    }

    async findAll(): Promise<User[]> {
        const users: User[] = await this.prisma.user.findMany();
        console.log(users);

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
