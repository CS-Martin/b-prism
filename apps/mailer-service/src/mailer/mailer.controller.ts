import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mailer Service Endpoint')
@Controller('mailer')
export class MailerController {}
