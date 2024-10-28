import { OmitType } from '@nestjs/swagger';
import { UsersDto } from './user.dto';

export class CreateUserDto extends OmitType(UsersDto, ['id'] as const) {}
