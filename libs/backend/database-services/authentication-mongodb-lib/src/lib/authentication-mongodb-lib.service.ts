import { UpdateUserDto, UserDto } from '@dto';
import { CreateUserDto } from '@dto';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';

@Injectable()
export class AuthenticationMongodbLibService {
    private readonly logger = new Logger(AuthenticationMongodbLibService.name);

    constructor(private readonly prisma: PrismaDbLibService) {}

    async create(userData: CreateUserDto): Promise<UserDto> {
        this.logger.log('Creating user', userData);

        const user = await this.prisma.user.create({
            data: {
                ...userData
            }
        });

        return user;
    }

    async update(id: string, userData: UpdateUserDto): Promise<UserDto> {
        this.logger.log('Updating user', userData);

        const user = await this.prisma.user.update({
            where: {
                id: id
            },
            data: userData
        });

        return user;
    }
}
