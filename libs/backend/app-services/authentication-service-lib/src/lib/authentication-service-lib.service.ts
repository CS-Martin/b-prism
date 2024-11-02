import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthenticationMongodbLibService } from '@authentication-mongodb-lib';
import { CreateUserDto, ResponseDto, UpdateUserDto, UserDto } from '@dto';
import { AuthenticationService } from './authentication-service.abstract.class';
import { comparePassword, hashPassword } from '@lib-utils';

@Injectable()
export class AuthenticationServiceLibService implements AuthenticationService {
    private readonly logger = new Logger(AuthenticationServiceLibService.name);

    constructor(private readonly authenticationMongodbService: AuthenticationMongodbLibService) {}

    async create(userData: CreateUserDto): Promise<ResponseDto<UserDto>> {
        this.logger.log('Creating user', userData);

        try {

            // Hash password
            const hashedPassword = await hashPassword(userData.password);
            userData.password = hashedPassword;

            const user: UserDto = await this.authenticationMongodbService.create(userData);

            const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, user);

            return response;
            
        } catch (error) {

            this.logger.error('Error creating user', error);

            throw new BadRequestException(error);

        }
    }

    async verify(email: string, password: string): Promise<ResponseDto<UserDto>> {
        this.logger.log('Verifying user', email);

        try {
            const user: UserDto | null = await this.authenticationMongodbService.findByEmail(email);

            if (!user) {
                throw new NotFoundException(`User with email ${email} not found`);
            }

            const isPasswordValid = await comparePassword(password, user.password);

            if (!isPasswordValid) {
                throw new UnauthorizedException('Invalid password');
            }

            const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, user);

            return response;
        } catch (error) {
            this.logger.error('Error verifying user', error);

            throw new BadRequestException(error);
        }
    }

    async update(id: string, newUserData: UpdateUserDto): Promise<ResponseDto<UserDto>> {
        this.logger.log('Updating user', newUserData);

        await this.findById(id);

        try {
            const user: UserDto = await this.authenticationMongodbService.update(id, newUserData);

            const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, user);

            return response;
        } catch (error) {

            this.logger.error('Error updating user', error);

            throw new BadRequestException(error);

        }
    }

    async findById(id: string): Promise<ResponseDto<UserDto>> {
        this.logger.log('Finding user', id);

        const user: UserDto | null = await this.authenticationMongodbService.findById(id);

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, user);

        return response;
    } 

    async findByEmail(email: string): Promise<ResponseDto<UserDto>> {
        this.logger.log('Finding user', email);

        const user: UserDto | null = await this.authenticationMongodbService.findByEmail(email);

        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, user);

        console.log(response);

        return response;
    }
}
