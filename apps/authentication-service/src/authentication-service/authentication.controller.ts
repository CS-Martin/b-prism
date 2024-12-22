import { AuthenticationServiceLibService } from '@authentication-service-lib';
import { UserServiceLibService } from '@b-prism/user-service-lib';
import { CreateUserDto, UpdateUserDto, VerifyUserDto } from '@dto';
import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication Endpoints')
@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationServiceLibService) {}

    @Post('create')
    create(@Body() createUserDto: CreateUserDto) {
        return this.authenticationService.create(createUserDto);
    }

    @Post('verify')
    verify(@Body() verifyUserDto: VerifyUserDto) {
        return this.authenticationService.verify(verifyUserDto.email, verifyUserDto.password);
    }

    @Put('update/:id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.authenticationService.update(id, updateUserDto);
    }
}
