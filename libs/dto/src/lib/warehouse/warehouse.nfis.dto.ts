import { ApiProperty } from '@nestjs/swagger';

export class WarehouseNonFoodItemsDto {
    @ApiProperty()
    family_kits?: number;

    @ApiProperty()
    sleeping_kits?: number;

    @ApiProperty()
    hygiene_kits?: number;

    @ApiProperty()
    kitchen_kits?: number;

    @ApiProperty()
    other_nfis?: number;

    [key: string]: any;
}
