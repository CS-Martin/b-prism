import { OmitType } from '@nestjs/swagger';
import { MailerDto } from './mailer.dto';

export class CreateMailerDto extends OmitType(MailerDto, ['id'] as const) {}
