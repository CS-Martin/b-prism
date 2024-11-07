import { OmitType } from '@nestjs/swagger';
import { WarehouseDto } from './warehouse.dto';

export class CreateWarehouseDto extends OmitType(WarehouseDto, ['id'] as const) {}
