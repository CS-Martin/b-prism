import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthenticationMongodbLibService } from '@authentication-mongodb-lib';
import { CreateUserDto, ResponseDto, UpdateUserDto, UserDto } from '@dto';
import { AuthenticationServiceAbstractClass } from './authentication-service.abstract.class';
import { comparePassword, hashPassword } from '@lib-utils';
import { UserServiceLibService } from '@b-prism/user-service-lib';
import { User, UserRole } from '@prisma/client';
import { ActivityLogServiceLibService } from '@b-prisma/activity-log-service-lib';

@Injectable()
export class AuthenticationServiceLibService implements AuthenticationServiceAbstractClass {
    private readonly logger = new Logger(AuthenticationServiceLibService.name);

    constructor(
        private readonly authenticationMongodbService: AuthenticationMongodbLibService,
        private readonly userServiceLibService: UserServiceLibService,
        private readonly activityLogLibService: ActivityLogServiceLibService,
    ) {}

    async create(userData: CreateUserDto): Promise<ResponseDto<UserDto>> {
        this.logger.log('Creating user', userData);

        try {
            // Hash password
            const hashedPassword = await hashPassword(userData.password);
            userData.password = hashedPassword;

            const user: User = await this.authenticationMongodbService.create(userData);

            await this.activityLogLibService.create('CREATE', `A new user account was successfully created for ${user.given_name} ${user.family_name}`, user.id);

            const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, this.convertToDto(user));

            return response;
        } catch (error) {
            this.logger.error('Error creating user', error);

            throw new BadRequestException(error);
        }
    }

    async verify(email: string, password: string): Promise<ResponseDto<UserDto>> {
        this.logger.log('Verifying user', email);

        try {
            const user: ResponseDto<UserDto> = await this.userServiceLibService.findByEmail(email);

            if (!user.body) {
                throw new NotFoundException(`User with email ${email} not found`);
            }

            const isPasswordValid = await comparePassword(password, user.body.password);

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid password');
            }

            const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, user.body);

            return response;
        } catch (error) {
            this.logger.error('Error verifying user', error);

            throw new BadRequestException(error);
        }
    }

    async update(id: string, newUserData: UpdateUserDto): Promise<ResponseDto<UserDto>> {
        this.logger.log('Updating user', newUserData);

        await this.userServiceLibService.findById(id);

        try {
            const user: User = await this.authenticationMongodbService.update(id, newUserData);

            await this.activityLogLibService.create('UPDATE', `Account details of user ${user.given_name} ${user.family_name} were sucessfully updated.`, id);

            const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, this.convertToDto(user));

            return response;
        } catch (error) {
            this.logger.error('Error updating user', error);

            throw new BadRequestException(error);
        }
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
