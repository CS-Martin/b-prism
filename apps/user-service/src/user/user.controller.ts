import { UserServiceLibService } from '@b-prism/user-service-lib';
import { UserDto } from '@dto';
import { ResponseDto } from '@dto';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'libs/backend/app-services/guards-service-lib/src/lib/jwt-auth.guard';

@ApiTags('User Endpoints')
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userServiceLibService: UserServiceLibService) {}

    @Get('all')
    async findAll(): Promise<ResponseDto<UserDto[]>> {
        return this.userServiceLibService.findAll();
    }

    @Get(':email')
    async findByEmail(@Param('email') email: string): Promise<ResponseDto<UserDto>> {
        return this.userServiceLibService.findByEmail(email);
    }
}
