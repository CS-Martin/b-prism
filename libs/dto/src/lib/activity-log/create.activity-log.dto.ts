import { OmitType } from '@nestjs/swagger';
import { ActivityLogDto } from './activity-log.dto';

export class CreateActivityLogDto extends OmitType(ActivityLogDto, ['id'] as const) {}
