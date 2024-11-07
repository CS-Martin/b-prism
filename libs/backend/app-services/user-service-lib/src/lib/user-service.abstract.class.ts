import { ResponseDto } from '@dto';
import { UserDto } from '@dto';

export abstract class UserServiceAbstractClass {
    abstract findAll(): Promise<ResponseDto<UserDto[]>>;

    abstract findById(id: string): Promise<ResponseDto<UserDto>>;

    abstract findByEmail(email: string): Promise<ResponseDto<UserDto>>;
}
