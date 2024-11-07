import { OmitType } from '@nestjs/swagger';
import { DispensingPointDto } from './dispensing-point.dto';

export class CreateDispensingPoint extends OmitType(DispensingPointDto, ['id'] as const) {}
