import { AuthenticationServiceLibService } from '@b-prism/authentication-service-lib';
import { UserServiceLibService } from '@b-prism/user-service-lib';
import { ChangePasswordDto, CreateUserDto, ResetPasswordDto, UpdateUserDto, VerifyEmailCode, VerifyUserDto } from '@dto';
import { Controller, Post, Body, Put, Param, Get } from '@nestjs/common';
import { ApiBody, ApiTags, getSchemaPath } from '@nestjs/swagger';

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
        return this.authenticationService.validateUserLogin(verifyUserDto.email, verifyUserDto.password);
    }

    @Put('update/:id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.authenticationService.update(id, updateUserDto);
    }

    @Put('change-password')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: '1234567890' },
                changePasswordDto: { $ref: getSchemaPath(ChangePasswordDto) },
            },
        },
    })
    changePassword(@Body() payload: { id: string; changePasswordDto: ChangePasswordDto }) {
        const { id, changePasswordDto } = payload;

        return this.authenticationService.changePassword(id, changePasswordDto);
    }

    @Put('reset-password')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
                resetPasswordDto: {
                    type: 'object',
                    properties: {
                        password: { type: 'string', example: 'password123' },
                        confirmPsassword: { type: 'string', example: 'password123' },
                    },
                },
            },
        },
    })
    resetPassword(@Body() payload: { email: string; resetPasswordDto: ResetPasswordDto }) {
        const { email, resetPasswordDto } = payload;

        return this.authenticationService.resetPassword(email, resetPasswordDto);
    }

    @Post('verify-email-code')
    verifyEmailCode(@Body() verifyEmailCode: VerifyEmailCode) {
        return this.authenticationService.verifyEmailCode(verifyEmailCode.email, verifyEmailCode.code);
    }
}
