import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AuthenticationMongodbLibService } from '@authentication-mongodb-lib';
import { CreateUserDto, ResponseDto, UpdateUserDto, UserDto } from '@dto';
import { AuthenticationService } from './authentication-service.abstract.class';

@Injectable()
export class AuthenticationServiceLibService implements AuthenticationService {
    private readonly logger = new Logger(AuthenticationServiceLibService.name);

    constructor(private readonly authenticationMongodbService: AuthenticationMongodbLibService) {}

    async create(createUserDto: CreateUserDto): Promise<ResponseDto<UserDto>> {
        this.logger.log('Creating user', createUserDto);

        try {
            const user: UserDto = await this.authenticationMongodbService.create(
                {
                    auth0_id: createUserDto.auth0_id ?? null,
                    name: createUserDto.name,
                    office: createUserDto.office,
                    position: createUserDto.position,
                    email: createUserDto.email,
                    password: createUserDto.password,
                    id_image_url: createUserDto.id_image_url ?? null,
                    role: createUserDto.role,
                    createdAt: createUserDto.createdAt,
                    updatedAt: createUserDto.updatedAt
                }
            );

            const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, user);

            return response;
        } catch (error) {

            this.logger.error('Error creating user', error);

            throw new BadRequestException(error);

        }
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseDto<UserDto>> {
        this.logger.log('Updating user', updateUserDto);

        await this.findById(id);

        try {
            const user: UserDto = await this.authenticationMongodbService.update(id, updateUserDto);

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
}
