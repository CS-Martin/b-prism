import { UserServiceLibService } from '@b-prism/user-service-lib';
import { UserDto } from '@dto';
import { ResponseDto } from '@dto';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'libs/backend/app-services/guards-service-lib/src/lib/jwt-auth.guard';

@ApiTags('User Endpoints')
@Controller('v1/users')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly userServiceLibService: UserServiceLibService) {}

    @Get()
    @ApiQuery({ name: 'email', required: false, description: 'Email of the user (optional)' })
    async findUsers(@Query('email') email?: string): Promise<ResponseDto<UserDto | UserDto[]>> {
        if (email) {
            return this.userServiceLibService.findByEmail(email);
        } else {
            return this.userServiceLibService.findAll();
        }
    }
}
