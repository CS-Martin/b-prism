import { CreateUserDto, ResponseDto, UserDto, UpdateUserDto, ChangePasswordDto, MailerDto, ResetPasswordDto } from '@dto';
import { User } from '@prisma/client';

export abstract class AuthenticationServiceAbstractClass {
    abstract create(createUserDto: CreateUserDto): Promise<ResponseDto<UserDto>>;

    abstract validateUserLogin(email: string, password: string): Promise<ResponseDto<UserDto>>;

    abstract sendVerificationCodeMail(email: string): Promise<ResponseDto<MailerDto>>;

    abstract changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<ResponseDto<UserDto>>;

    abstract resetPassword(email: string, resetPasswordDto: ResetPasswordDto): Promise<ResponseDto<UserDto>>;

    abstract update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseDto<UserDto>>;

    abstract convertToDto(user: User): UserDto;
}
