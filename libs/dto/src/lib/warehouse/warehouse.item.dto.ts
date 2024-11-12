import { ApiProperty } from '@nestjs/swagger';
import { WarehouseThresholdDto } from './warehouse.threshold.dto';

export class WarehouseItemDto {
    @ApiProperty()
    name!: string;

    @ApiProperty()
    quantity!: number;

    @ApiProperty()
    unit_price!: number;

    @ApiProperty({ type: WarehouseThresholdDto })
    warehouseThreshold!: WarehouseThresholdDto;

    [key: string]: any;
}
