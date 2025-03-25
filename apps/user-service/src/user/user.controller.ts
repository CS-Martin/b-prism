import { UserServiceLibService } from '@b-prism/user-service-lib';
import { UpdateUserDto, UserDto } from '@dto';
import { ResponseDto } from '@dto';
import { Body, Controller, Get, Headers, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiSchema, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'libs/backend/app-services/guards-service-lib/src/lib/jwt-auth.guard';

@ApiTags('User Endpoints')
@ApiBearerAuth()
@Controller(`${new ConfigService().get('API_VERSION')}/users`)
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

    @Put(':id')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                role: { type: 'string', example: 'admin' },
            },
        },
    })
    updateUserRole(@Param('id') id: string, @Body('role') role: string, @Headers('X-Author') author: string) {
        return this.userServiceLibService.updateUserRole(id, role, author);
    }
}
