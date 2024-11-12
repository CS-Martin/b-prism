import { ApiProperty } from '@nestjs/swagger';

export class WarehouseCapacityDto {
    @ApiProperty()
    current_stock!: number;

    @ApiProperty()
    max_stock!: number;

    [key: string]: any;
}
