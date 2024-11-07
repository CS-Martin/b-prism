import { ApiProperty } from '@nestjs/swagger';

export class WarehouseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    longitude!: string;

    @ApiProperty()
    latitude!: string;

    @ApiProperty()
    capacity?: string;

    @ApiProperty()
    userId?: string;

    @ApiProperty()
    createdAt!: string;

    @ApiProperty()
    updatedAt!: string;
}
