import { ApiProperty } from '@nestjs/swagger';

export class WarehouseThresholdDto {
    @ApiProperty()
    min!: number;

    @ApiProperty()
    max!: number;

    @ApiProperty()
    last_updated!: Date;
}
