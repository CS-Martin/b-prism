import { CreateUserDto, ResponseDto, UserDto, UpdateUserDto } from '@dto';

export abstract class AuthenticationService {
    abstract create(
        createUserDto: CreateUserDto,
    ): Promise<ResponseDto<UserDto>>;

    abstract verify(
        email: string,
        password: string,
    ): Promise<ResponseDto<UserDto>>;

    abstract update(
        id: string,
        updateUserDto: UpdateUserDto,
    ): Promise<ResponseDto<UserDto>>;
}
