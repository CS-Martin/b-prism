import { ApiProperty } from '@nestjs/swagger';
import { WarehouseAddressDto } from './warehouse.address.dto';
import { Type } from '@prisma/client';
import { WarehouseNonFoodItemsDto } from './warehouse.nfis.dto';

export class WarehouseDto {
    @ApiProperty()
    id!: string;

    @ApiProperty({ enum: Type, default: Type.warehouse })
    type: Type = Type.warehouse;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    longitude!: string;

    @ApiProperty()
    latitude!: string;

    @ApiProperty()
    capacity?: number;

    @ApiProperty()
    cost_of_stockpile?: number;

    @ApiProperty()
    family_food_packs?: number;

    @ApiProperty()
    standby_funds?: number;

    @ApiProperty()
    non_food_items?: WarehouseNonFoodItemsDto;

    @ApiProperty({ type: WarehouseAddressDto })
    address?: WarehouseAddressDto;

    @ApiProperty()
    user_id?: string;

    @ApiProperty()
    created_at?: Date;

    @ApiProperty()
    updated_at?: Date;
}
