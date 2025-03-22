import { LoginProvider } from '@b-prism/types';
import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { User } from '@prisma/client';
import { UpdateUserDto } from '@dto';

@Injectable()
export class UserMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async update(id: string, updateUserDto: UpdateUserDto): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: { ...updateUserDto },
        });
    }

    async updateUserRole(id: string, newRole: string): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: { role: newRole },
        });
    }

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

    async findGmailUserByEmailAndProvider(email: string): Promise<User | null> {
        const user: User | null = await this.prisma.user.findFirst({
            where: {
                email: email,
            },
        });

        return user;
    }
}
