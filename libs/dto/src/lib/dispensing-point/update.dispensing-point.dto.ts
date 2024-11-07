import { PartialType } from '@nestjs/swagger';
import { DispensingPointDto } from './dispensing-point.dto';

export class UpdateDispensingPoint extends PartialType(DispensingPointDto) {}
