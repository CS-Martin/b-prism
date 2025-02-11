import { CreateUserDto, ResponseDto, UserDto, UpdateUserDto, ChangePasswordDto, MailerDto } from '@dto';
import { User } from '@prisma/client';

export abstract class AuthenticationServiceAbstractClass {
    abstract create(createUserDto: CreateUserDto): Promise<ResponseDto<UserDto>>;

    abstract verify(email: string, password: string): Promise<ResponseDto<UserDto>>;

    abstract forgotPassword(email: string): Promise<ResponseDto<MailerDto>>;

    abstract changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<ResponseDto<UserDto>>;

    abstract update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseDto<UserDto>>;

    abstract convertToDto(user: User): UserDto;
}
