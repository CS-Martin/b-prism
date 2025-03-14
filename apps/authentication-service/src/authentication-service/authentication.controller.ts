import { AuthenticationServiceLibService } from '@b-prism/authentication-service-lib';
import { ChangePasswordDto, CreateUserDto, ResetPasswordDto, UpdateUserDto, VerifyEmailCode, VerifyUserDto } from '@dto';
import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { ApiBody, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('Authentication Endpoints')
@Controller(`${new ConfigService().get('API_VERSION')}/auth`)
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationServiceLibService) {}

    @Post('users')
    create(@Body() createUserDto: CreateUserDto) {
        return this.authenticationService.create(createUserDto);
    }

    @Post('login')
    verify(@Body() verifyUserDto: VerifyUserDto) {
        return this.authenticationService.validateUserLogin(verifyUserDto.email, verifyUserDto.password);
    }

    @Put('users/:id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.authenticationService.update(id, updateUserDto);
    }

    @Put('users/:id/password')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                changePasswordDto: { $ref: getSchemaPath(ChangePasswordDto) },
            },
        },
    })
    changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
        return this.authenticationService.changePassword(id, changePasswordDto);
    }

    @Post('users/reset-password')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                resetPasswordDto: {
                    type: 'object',
                    properties: {
                        password: { type: 'string', example: 'password123' },
                        confirmPassword: { type: 'string', example: 'password123' },
                    },
                },
            },
        },
    })
    resetPassword(@Body() payload: { email: string; resetPasswordDto: ResetPasswordDto }) {
        return this.authenticationService.resetPassword(payload.email, payload.resetPasswordDto);
    }

    @Post('users/verify-email-code')
    verifyEmailCode(@Body() verifyEmailCode: VerifyEmailCode) {
        return this.authenticationService.verifyEmailCode(verifyEmailCode.email, verifyEmailCode.code);
    }

    @Post('refresh-token')
    async refreshToken(@Body() body: { refreshToken: string }) {
        return this.authenticationService.refreshToken(body.refreshToken);
    }
}
