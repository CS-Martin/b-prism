import { AuthenticationServiceLibService } from '@b-prism/authentication-service-lib';
import { CreateMailerDto } from '@dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mailer Service Endpoint')
@Controller('mailer')
export class MailerController {
    constructor(private readonly authenticationServiceLibService: AuthenticationServiceLibService) {}

    @Post('upsert')
    upsert(@Body() email: string) {
        return this.authenticationServiceLibService.forgotPassword(email);
    }
}
