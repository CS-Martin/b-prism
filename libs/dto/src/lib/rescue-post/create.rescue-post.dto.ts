import { OmitType } from '@nestjs/swagger';
import { RescuePostDto } from './rescue-post.dto';

export class CreateRescuePostDto extends OmitType(RescuePostDto, ['id'] as const) {}
