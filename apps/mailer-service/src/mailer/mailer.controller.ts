import { AuthenticationServiceLibService } from '@b-prism/authentication-service-lib';
import { CreateMailerDto } from '@dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('Mailer Service Endpoint')
@Controller('mailer')
export class MailerController {
    constructor(private readonly authenticationServiceLibService: AuthenticationServiceLibService) {}

    @Post('upsert')
    @ApiBody({ schema: { type: 'object', properties: { email: { type: 'string' } } } })
    upsert(@Body('email') email: string) {
        return this.authenticationServiceLibService.sendVerificationCodeMail(email);
    }
}
