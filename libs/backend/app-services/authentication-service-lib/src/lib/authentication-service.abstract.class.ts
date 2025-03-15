import { LoginProvider } from '@b-prism/types';
import { CreateUserDto, ResponseDto, UserDto, UpdateUserDto, ChangePasswordDto, MailerDto, ResetPasswordDto } from '@dto';
import { User } from '@prisma/client';
import { PublicUserDto } from 'libs/dto/src/lib/user/public/public.user.dto';

export abstract class AuthenticationServiceAbstractClass {
    abstract create(createUserDto: CreateUserDto, provider: LoginProvider): Promise<ResponseDto<PublicUserDto>>;

    abstract validateUserLogin(email: string, password: string, provider: LoginProvider): Promise<ResponseDto<{ user: PublicUserDto; access_token: string }>>;

    abstract refreshToken(refreshToken: string): Promise<{ newAccessToken: string }>;

    abstract sendVerificationCodeMail(email: string): Promise<ResponseDto<MailerDto>>;

    abstract changePassword(id: string, changePasswordDto: ChangePasswordDto): Promise<ResponseDto<UserDto>>;

    abstract resetPassword(email: string, resetPasswordDto: ResetPasswordDto): Promise<ResponseDto<UserDto>>;

    abstract update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseDto<UserDto>>;

    abstract convertToDto(user: User): UserDto;

    abstract convertToPublicDto(userDto: User): PublicUserDto;
}
