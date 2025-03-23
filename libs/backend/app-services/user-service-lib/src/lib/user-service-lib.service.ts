import { ActivityLogServiceLibService } from '@b-prism/activity-log-service-lib';
import { UserMongodbLibService } from '@b-prism/user-mongodb-lib';
import { UpdateUserDto, UserDto } from '@dto';
import { ResponseDto } from '@dto';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserServiceAbstractClass } from './user-service.abstract.class';
import { User } from '@prisma/client';
import { LoginProvider } from '@b-prism/types';

@Injectable()
export class UserServiceLibService implements UserServiceAbstractClass {
    private readonly logger = new Logger(UserServiceLibService.name);

    constructor(
        private readonly userMongodbLibService: UserMongodbLibService,
        private readonly activityLogService: ActivityLogServiceLibService,
    ) {}

    async updateUserRole(id: string, newRole: string, author: string): Promise<void> {
        this.logger.log('Updating role of user: ', id);

        if (!id) {
            console.error('User ID must be provided.');
            throw new BadRequestException('User ID must be provided.');
        }

        if (!newRole) {
            console.error('New role must be provided.');
            throw new BadRequestException('New role must be provided.');
        }

        try {
            const existingUser = (await this.findById(id)).body;

            await this.userMongodbLibService.updateUserRole(id, newRole);

            await this.activityLogService.create({
                action: 'UPDATE',
                description: `${author} successfully updated user ${existingUser.given_name + ' ' + existingUser.family_name} to role ${newRole}.`,
                resource: 'User',
                resource_id: id,
                author: author,
                timestamp: new Date(),
            });
        } catch (error) {
            this.logger.error('Error updating user', error);

            throw new BadRequestException('Failed to update user.');
        }
    }

    async updateRefreshToken(id: string, provider: LoginProvider, hashedRefreshToken: string): Promise<ResponseDto<UserDto>> {
        this.logger.log('Refreshing token for user with id: ', id);

        try {
            const user: User = await this.userMongodbLibService.updateRefreshToken(id, provider, hashedRefreshToken);

            const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(200, this.convertToDto(user));

            return response;
        } catch (error) {
            this.logger.error('Error updating user', error);

            throw new BadRequestException('Failed to update user.');
        }
    }

    async findAll(): Promise<ResponseDto<UserDto[]>> {
        this.logger.log('Finding all users');

        const users: User[] = await this.userMongodbLibService.findAll();

        const response: ResponseDto<UserDto[]> = new ResponseDto<UserDto[]>(201, users.map(this.convertToDto));

        return response;
    }

    async findById(id: string): Promise<ResponseDto<UserDto>> {
        this.logger.log('Finding user', id);

        const user: User | null = await this.userMongodbLibService.findById(id);

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found. Please try again.`);
        }

        const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, this.convertToDto(user));

        return response;
    }

    async findByEmail(email: string): Promise<ResponseDto<UserDto | null>> {
        this.logger.log('Finding user', email);

        const user: User | null = await this.userMongodbLibService.findByEmail(email);

        if (!user) {
            console.error(`User with email ${email} not found`);

            throw new NotFoundException(`User with email ${email} not found. Please try again.`);
        }

        const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, this.convertToDto(user));

        return response;
    }

    async findGmailUserByEmailWithoutThrow(email: string): Promise<ResponseDto<UserDto | null>> {
        this.logger.log('Finding user', email);

        const user: User | null = await this.userMongodbLibService.findGmailUserByEmailAndProvider(email);

        const response: ResponseDto<UserDto | null> = new ResponseDto<UserDto | null>(200, user ? this.convertToDto(user) : null);

        return response;
    }

    convertToDto(user: User): UserDto {
        const userDto: UserDto = new UserDto();

        userDto.id = user.id || '';
        userDto.provider = (user.provider as LoginProvider) || 'credentials';
        userDto.given_name = user.given_name || '';
        userDto.family_name = user.family_name || '';
        userDto.email = user.email || '';
        userDto.password = user.password || '';
        userDto.office = user.office || '';
        userDto.position = user.position || '';
        userDto.role = user.role;
        userDto.id_image_url = user.id_image_url || '';
        userDto.refresh_token = user.refresh_token || '';
        userDto.created_at = user.created_at;
        userDto.updated_at = user.updated_at;

        return userDto;
    }
}
