import { UserMongodbLibService } from '@b-prism/user-mongodb-lib';
import { UserDto } from '@dto';
import { ResponseDto } from '@dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserServiceAbstractClass } from './user-service.abstract.class';

@Injectable()
export class UserServiceLibService implements UserServiceAbstractClass {
    private readonly logger = new Logger(UserServiceLibService.name);
    
    constructor(
        private readonly userMongodbLibService: UserMongodbLibService,
    ) {}

    async findAll(): Promise<ResponseDto<UserDto[]>> {
        this.logger.log('Finding all users');

        const users: UserDto[] = await this.userMongodbLibService.findAll();

        const response: ResponseDto<UserDto[]> = new ResponseDto<UserDto[]>(201, users);

        return response;
    }

    async findById(id: string): Promise<ResponseDto<UserDto>> {
        this.logger.log('Finding user', id);

        const user: UserDto | null = await this.userMongodbLibService.findById(id);

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, user);

        return response;
    } 

    async findByEmail(email: string): Promise<ResponseDto<UserDto>> {
        this.logger.log('Finding user', email);

        const user: UserDto | null = await this.userMongodbLibService.findByEmail(email);

        if (!user) {
            throw new NotFoundException(`User with email ${email} not found`);
        }

        const response: ResponseDto<UserDto> = new ResponseDto<UserDto>(201, user);

        return response;
    }
}
