import { LoginProvider } from './../../../../../types/src/lib/provider.type';
import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthenticationMongodbLibService } from '@b-prism/authentication-mongodb-lib';
import { ChangePasswordDto, CreateActivityLogDto, CreateMailerDto, CreateUserDto, MailerDto, PublicUserDto, ResetPasswordDto, ResponseDto, UpdateUserDto, UserDto } from '@dto';
import { AuthenticationServiceAbstractClass } from './authentication-service.abstract.class';
import { comparePassword, hashPassword, isRefreshTokenExpired } from '@b-prism/lib-utils';
import { UserServiceLibService } from '@b-prism/user-service-lib';
import { Mailer, User, UserRole } from '@prisma/client';
import { ActivityLogServiceLibService } from '@b-prism/activity-log-service-lib';
import { MailerServiceLibService } from '@b-prism/mailer-service-lib';

import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { addMinutes } from 'date-fns';
import { MailerMongodbLibService } from '@b-prism/mailer-mongodb-lib';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationServiceLibService implements AuthenticationServiceAbstractClass {
    private readonly logger = new Logger(AuthenticationServiceLibService.name);

    constructor(
        private readonly authenticationMongodbService: AuthenticationMongodbLibService,
        private readonly mailerMongodbService: MailerMongodbLibService,

        private readonly userServiceLibService: UserServiceLibService,
        private readonly activityLogLibService: ActivityLogServiceLibService,
        private readonly mailerServiceLibService: MailerServiceLibService,
        private readonly jwtService: JwtService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<ResponseDto<PublicUserDto>> {
        this.logger.log('Creating user with provider:', createUserDto);
        const logging_var: CreateActivityLogDto = new CreateActivityLogDto();

        try {
            if (!createUserDto.provider || (createUserDto.provider !== 'credentials' && createUserDto.provider !== 'google'))
                throw new BadRequestException('Provider is required.');

            if (createUserDto.provider === 'credentials') {
                if (!createUserDto.password) {
                    throw new BadRequestException('Password is required.');
                }

                // Hash password
                createUserDto.password = await hashPassword(createUserDto.password);
            } else if (createUserDto.provider === 'google') {
                // Remove password field if it exists for Google users
                delete createUserDto.password;
            }

            // Create user in the database
            const user: User = await this.authenticationMongodbService.create(createUserDto);

            // Log creation activity
            logging_var.action = 'CREATE';
            logging_var.description = `A new user account was successfully created for ${user.given_name} ${user.family_name} using provider ${createUserDto.provider}`;
            logging_var.resource = 'Authentication';
            logging_var.resource_id = user.id;
            logging_var.author = `${user.given_name} ${user.family_name}`;

            await this.activityLogLibService.create(logging_var);

            // Convert user to public DTO
            const response: ResponseDto<PublicUserDto> = new ResponseDto<PublicUserDto>(201, this.convertToPublicDto(user));

            // Return the created user as a response
            return response;
        } catch (error) {
            this.logger.error('Error creating user', error);

            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException('There was an issue creating your account. Please try again later.');
        }
    }

    /**
     * Validates user's email and password when logging in.
     * @param email
     * @param password
     * @returns A promise that resolves to the validated user.
     * @returns UnauthorizedException if email or password are incorrect.
     */
    async validateUserLogin(email: string, password: string, provider: LoginProvider): Promise<ResponseDto<{ user: PublicUserDto; accessToken: string }>> {
        this.logger.log('Validating user login', email);

        try {
            const existingUser: ResponseDto<UserDto> = await this.userServiceLibService.findByEmail(email);

            if (!existingUser.body) {
                throw new NotFoundException(`User with email ${email} not found. Please try again.`);
            }

            const user = existingUser.body;

            // If logging in with credentials, validate password
            if (provider === 'credentials') {
                if (!user.password || !(await comparePassword(password, user.password))) {
                    throw new UnauthorizedException('The password you entered is incorrect. Please try again.');
                }
            }

            // Generate access token
            const accessToken = await this.generateAccessToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });

            let refreshToken = user.refresh_token; // Default to existing token

            // Check if refresh token is missing or expired (implement token expiration logic)
            const expired = !user.refresh_token || isRefreshTokenExpired(user.refresh_token);

            if (expired) {
                // Generate new refresh token
                refreshToken = await this.generateRefreshToken({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                });

                // Hash and store the refresh token in DB
                const hashedRefreshToken = await hashPassword(refreshToken);
                await this.userServiceLibService.updateRefreshToken(user.id, provider, hashedRefreshToken);
            }

            // Return response (DO NOT send refresh token in body, use HttpOnly cookie instead)
            return new ResponseDto<{ user: PublicUserDto; accessToken: string }>(201, { user: this.convertToPublicDto(user), accessToken });
        } catch (error) {
            this.logger.error('Error validating user', error);

            if (error instanceof UnauthorizedException || error instanceof NotFoundException) {
                throw error;
            }

            throw new BadRequestException('Invalid credentials or an error occurred. Please try again.');
        }
    }

    /**
     * Sends a verification code to user's email
     * @example Used when user request for password reset/forgot password.
     *
     * @param email - the user's email
     * @returns A Promise containing the creater mailer
     * @throws BadRequestException when it fails to send the email code
     */
    async sendVerificationCodeMail(email: string): Promise<ResponseDto<MailerDto>> {
        this.logger.log('Forgetting password for user', email);

        const user: UserDto = (await this.userServiceLibService.findByEmail(email)).body;

        const code: string = randomInt(100000, 999999).toString();
        const expiresAt: Date = addMinutes(new Date(), 3);

        try {
            // Generate code
            // Generate expiration date 3 minutes
            // Send to user's gmail

            const mailer: CreateMailerDto = new CreateMailerDto();

            mailer.code = code;
            mailer.expires_at = expiresAt;
            mailer.user_id = user.id;
            mailer.created_at = new Date();

            this.logger.log('Mailer Data', mailer);

            const upsertedMailer: Mailer = await this.mailerMongodbService.upsert(mailer);

            if (!upsertedMailer) {
                this.logger.error(`Failed to create verification code email to ${email}. Please try again.`);

                throw new BadRequestException(`Failed to create verification code email to your account. Please try again.`);
            }

            await this.mailerServiceLibService.sendResetPasswordAlert(user);
            await this.mailerServiceLibService.sendVerificationCode(user, upsertedMailer);

            const response: ResponseDto<MailerDto> = new ResponseDto<MailerDto>(201, upsertedMailer);

            return response;
        } catch (error) {
            this.logger.error('An error occured while forgetting user password', user.id);

            throw new BadRequestException(error);
        }
    }

    /**
     * Currently used when a user forgets their password
     * @param email - Email of the user
     * @param resetPasswordDto - New password and confirm password
     * @returns A promise containing the user with newly reset password
     * @throws BadRequestException if password doesn't match.
     */
    async resetPassword(email: string, resetPasswordDto: ResetPasswordDto): Promise<ResponseDto<UserDto>> {
        this.logger.log('Forgetting password for user', email);

        if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
            this.logger.error(`Password doesn't match for ${email} attempt to reset their password`);

            throw new BadRequestException(`Password doesn&apos;t match. Please try again. `);
        }

        const existingUser: UserDto = (await this.userServiceLibService.findByEmail(email)).body;

        this.logger.log('Existing user', existingUser);

        try {
            const hashedPassword = await hashPassword(resetPasswordDto.password);
            const user: User = await this.authenticationMongodbService.resetPassword(existingUser.id, hashedPassword);

            const logging_var: CreateActivityLogDto = new CreateActivityLogDto();

            logging_var.action = 'UPDATE';
            logging_var.description = `${user.given_name} ${user.family_name} has reset their account password.`;
            logging_var.resource = 'Authentication';
            logging_var.resource_id = user.id;
            logging_var.author = `${user.given_name} ${user.family_name}`;

            await this.activityLogLibService.create(logging_var);

            const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(200, this.convertToDto(user));

            return response;
        } catch (error) {
            this.logger.error('An error occured while resetting password', existingUser.id);

            throw new BadRequestException(error);
        }
    }

    /**
     * Verifies the code input sent by the user
     * @param email
     * @param code
     * @returns A boolean (true: if code match and exists in database, otherwise false.)
     * @throws BadRequestException if code doesn't match
     */
    async verifyEmailCode(email: string, code: string): Promise<ResponseDto<boolean>> {
        this.logger.log('Verifying the code sent to user', email, code);

        const user: UserDto = (await this.userServiceLibService.findByEmail(email)).body;

        try {
            const mailer: MailerDto | null = await this.mailerMongodbService.verifyEmailCode(user.id, code);

            if (!mailer) {
                this.logger.log(`Invalid verification code for user: ${user.given_name} ${user.family_name}`);

                throw new BadRequestException('The verification code you entered is incorrect. Please check the code and try again.');
            }

            // If mailer.expireAt already expired throw error to notify in the client that code is already expired
            const now = new Date();
            if (new Date(mailer.expires_at) < now) {
                this.logger.warn(`Verification code expired for user: ${user.id}`);

                throw new BadRequestException('The verification code has expired. Please request a new code and try again');
            }

            return new ResponseDto<boolean>(200, true);
        } catch (error) {
            this.logger.error('An error occured while verifying code sent', user.id, code);

            throw new BadRequestException(error);
        }
    }

    /**
     * A function used to change a users' password normally (not like reset passwrd)
     * @param id - user's ID
     * @param changePasswordDto - Contains old password and new password
     * @returns A promise with the newly updated user's password
     */
    async changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<ResponseDto<UserDto>> {
        this.logger.log('Changing password of user', id);

        const user: UserDto = (await this.userServiceLibService.findById(id)).body;

        try {
            if (!user.password) {
                throw new BadRequestException('User password is not set.');
            }

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

    async refreshToken(refreshToken: string): Promise<{ newAccessToken: string }> {
        this.logger.log('Refreshing token:', refreshToken);

        try {
            if (!refreshToken) {
                throw new UnauthorizedException('Refresh token is required.');
            }
            // Verify refresh token
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env['JWT_REFRESH_SECRET'],
            });

            // Generate a new access token
            const newAccessToken = this.jwtService.sign(
                {
                    sub: payload.sub,
                    email: payload.email,
                    role: payload.role,
                },
                { secret: process.env['JWT_SECRET'], expiresIn: '60s' },
            );

            return { newAccessToken: newAccessToken };
        } catch (error) {
            this.logger.error(`An error occurred while refreshing token: ${error}`);
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async generateAccessToken(user: { id: string; email: string; role: string }) {
        const payload = { sub: user.id, email: user.email, role: user.role };

        return this.jwtService.sign(payload, {
            secret: process.env['JWT_TOKEN'],
            expiresIn: '3d',
        });
    }

    async generateRefreshToken(user: { id: string; email: string; role: string }) {
        const payload = { sub: user.id, email: user.email, role: user.role };

        return this.jwtService.sign(payload, {
            secret: process.env['JWT_REFRESH_SECRET'],
            expiresIn: '10d',
        });
    }

    convertToDto(user: User): UserDto {
        const userDto: UserDto = new UserDto();

        userDto.id = user.id ?? '';
        userDto.provider = (user.provider as LoginProvider) ?? 'credentials';
        userDto.given_name = user.given_name ?? '';
        userDto.family_name = user.family_name ?? '';
        userDto.email = user.email ?? '';
        userDto.password = user.password ?? '';
        userDto.office = user.office ?? '';
        userDto.position = user.position ?? '';
        userDto.role = user.role ?? UserRole.unverified;
        userDto.id_image_url = user.id_image_url ?? '';
        userDto.created_at = user.created_at;
        userDto.updated_at = user.updated_at;

        return userDto;
    }

    convertToPublicDto(user: User | UserDto): PublicUserDto {
        const userDto: PublicUserDto = new PublicUserDto();

        userDto.id = user.id ?? '';
        userDto.provider = (user.provider as LoginProvider) ?? 'credentials';
        userDto.given_name = user.given_name ?? '';
        userDto.family_name = user.family_name ?? '';
        userDto.email = user.email ?? '';
        userDto.office = user.office ?? '';
        userDto.position = user.position ?? '';
        userDto.role = user.role ?? UserRole.unverified;
        userDto.id_image_url = user.id_image_url ?? '';
        userDto.refresh_token = user.refresh_token ?? '';
        userDto.created_at = user.created_at;
        userDto.updated_at = user.updated_at;

        return userDto;
    }
}
