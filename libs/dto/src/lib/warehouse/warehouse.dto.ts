import { ApiProperty } from '@nestjs/swagger';
import { WarehouseAddressDto } from './warehouse.address.dto';
import { WarehouseItemDto } from './warehouse.item.dto';
import { WarehouseCapacityDto } from './warehouse.capacity.dto';
import { Type } from '@prisma/client';

export class WarehouseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    type!: Type;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    longitude!: string;

    @ApiProperty()
    latitude!: string;

    @ApiProperty({ type: WarehouseAddressDto })
    address?: WarehouseAddressDto;

    @ApiProperty({ type: [WarehouseItemDto] })
    items?: WarehouseItemDto[];

    @ApiProperty({ type: WarehouseCapacityDto })
    capacity!: WarehouseCapacityDto;

    @ApiProperty()
    userId!: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}
