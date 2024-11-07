import { PartialType } from '@nestjs/swagger';
import { WarehouseDto } from './warehouse.dto';

export class UpdateWarehouseDto extends PartialType(WarehouseDto) {}
