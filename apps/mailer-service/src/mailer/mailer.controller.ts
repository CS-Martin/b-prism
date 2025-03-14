import { AuthenticationServiceLibService } from '@b-prism/authentication-service-lib';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

@ApiTags('Mailer Service Endpoint')
@Controller(`${new ConfigService().get('API_VERSION')}/mailers`)
export class MailerController {
    constructor(private readonly authenticationServiceLibService: AuthenticationServiceLibService) {}

    @Post()
    @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' } } } })
    upsert(@Body('email') email: string) {
        return this.authenticationServiceLibService.sendVerificationCodeMail(email);
    }
}
