import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthenticationMongodbLibService } from '@b-prism/authentication-mongodb-lib';
import { ChangePasswordDto, CreateActivityLogDto, CreateMailerDto, CreateUserDto, ResponseDto, UpdateUserDto, UserDto } from '@dto';
import { AuthenticationServiceAbstractClass } from './authentication-service.abstract.class';
import { comparePassword, hashPassword } from '@lib-utils';
import { UserServiceLibService } from '@b-prism/user-service-lib';
import { User, UserRole } from '@prisma/client';
import { ActivityLogServiceLibService } from '@b-prisma/activity-log-service-lib';

import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { addMinutes } from 'date-fns';
import { MailerMongodbLibService } from '@b-prism/mailer-mongodb-lib';

@Injectable()
export class AuthenticationServiceLibService implements AuthenticationServiceAbstractClass {
    private readonly logger = new Logger(AuthenticationServiceLibService.name);

    constructor(
        private readonly authenticationMongodbService: AuthenticationMongodbLibService,
        private readonly mailerMongodbService: MailerMongodbLibService,
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

            const logging_var: CreateActivityLogDto = new CreateActivityLogDto();

            logging_var.action = 'CREATE';
            logging_var.description = `A new user account was successfully created for ${user.given_name} ${user.family_name}`;
            logging_var.resource = 'Authentication';
            logging_var.resource_id = user.id;
            logging_var.author = `${user.given_name} ${user.family_name}`;

            await this.activityLogLibService.create(logging_var);

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

    async forgotPassword(email: string): Promise<void> {
        this.logger.log('Forgetting password for user', email);

        const user: UserDto = (await this.userServiceLibService.findByEmail(email)).body;

        const code: string = randomInt(100000, 999999).toString();
        const expiresAt: Date = addMinutes(new Date(), 3);

        console.log('code', code, 'dete', expiresAt);

        try {
            // Generate code
            // Generate expiration date 3 minutes
            // Send to user's gmail

            const mailer: CreateMailerDto = new CreateMailerDto();

            mailer.code = code;
            mailer.expires_at = expiresAt;
            mailer.user_id = user.id;
            mailer.created_at = new Date();

            this.logger.log('Mailer Data ===========', mailer);

            await this.mailerMongodbService.upsert(mailer);
        } catch (error) {
            this.logger.error('An error occured while forgetting user password', user.id);

            throw new BadRequestException(error);
        }
    }

    async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<ResponseDto<UserDto>> {
        this.logger.log('Changing password of user', id);

        const user: UserDto = (await this.userServiceLibService.findById(id)).body;

        try {
            const isOldPasswordValid: boolean = await bcrypt.compare(changePasswordDto.oldPassword, user.password);

            if (!isOldPasswordValid) {
                throw new BadRequestException('Old password is incorrect');
            }

            const hashedNewPassword: string = await hashPassword(changePasswordDto.oldPassword);
            user.password = hashedNewPassword;

            const updatedUser: User = await this.authenticationMongodbService.changePassword(user);
            const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, this.convertToDto(updatedUser));

            return response;
        } catch (error) {
            this.logger.error('An error occured while changing user password', user.id);

            throw new BadRequestException(error);
        }
    }

    async update(id: string, newUserData: UpdateUserDto): Promise<ResponseDto<UserDto>> {
        this.logger.log('Updating user', newUserData);

        await this.userServiceLibService.findById(id);

        try {
            const user: User = await this.authenticationMongodbService.update(id, newUserData);

            const logging_var: CreateActivityLogDto = new CreateActivityLogDto();

            logging_var.action = 'UPDATE';
            logging_var.description = `Account details of user ${user.given_name} ${user.family_name} were sucessfully updated`;
            logging_var.resource = 'Authentication';
            logging_var.resource_id = user.id;
            logging_var.author = `${user.given_name} + ${user.family_name}`;

            await this.activityLogLibService.create(logging_var);

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
