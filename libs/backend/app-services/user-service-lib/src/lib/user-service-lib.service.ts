import { UserMongodbLibService } from '@b-prism/user-mongodb-lib';
import { UserDto } from '@dto';
import { ResponseDto } from '@dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserServiceAbstractClass } from './user-service.abstract.class';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class UserServiceLibService implements UserServiceAbstractClass {
    private readonly logger = new Logger(UserServiceLibService.name);

    constructor(private readonly userMongodbLibService: UserMongodbLibService) {}

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

    async findByEmail(email: string): Promise<ResponseDto<UserDto>> {
        this.logger.log('Finding user', email);

        const user: User | null = await this.userMongodbLibService.findByEmail(email);

        if (!user) {
            console.error(`User with email ${email} not found`);

            throw new NotFoundException(`User with email ${email} not found. Please try again.`);
        }

        const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, this.convertToDto(user));

        return response;
    }

    convertToDto(user: User): UserDto {
        const userDto: UserDto = new UserDto();

        userDto.id = user.id || '';
        userDto.given_name = user.given_name || '';
        userDto.family_name = user.family_name || '';
        userDto.email = user.email || '';
        userDto.password = user.password || '';
        userDto.office = user.office || '';
        userDto.position = user.position || '';
        userDto.role = user.role || UserRole.unverified;
        userDto.id_image_url = user.id_image_url || '';
        userDto.createdAt = user.createdAt;
        userDto.updatedAt = user.updatedAt;

        return userDto;
    }
}
