import { OmitType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class CreateUserDto extends OmitType(UserDto, ['id', 'refresh_token'] as const) {}
