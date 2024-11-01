import { UpdateUserDto, UserDto } from '@dto';
import { CreateUserDto } from '@dto';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';

@Injectable()
export class AuthenticationMongodbLibService {
    private readonly logger = new Logger(AuthenticationMongodbLibService.name);

    constructor(private readonly prisma: PrismaDbLibService) {}

    async create(createUserDto: CreateUserDto): Promise<UserDto> {
        this.logger.log('Creating user', createUserDto);

        const user = await this.prisma.user.create({
            data: createUserDto
        });

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
        this.logger.log('Updating user', updateUserDto);

        const user = await this.prisma.user.update({
            where: {
                sid: id
            },
            data: updateUserDto
        });

        return user;
    }

    async findById(id: string): Promise<UserDto | null> {
        this.logger.log('Finding user', id);

        const user: UserDto | null = await this.prisma.user.findUnique({
            where: {
                sid: id
            }
        });

        return user;
    }
}
