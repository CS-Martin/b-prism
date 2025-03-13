import { ApiProperty } from '@nestjs/swagger';
import { DispensingPointAddressDto } from './dispensing-point.address.dto';
import { Type } from '@prisma/client';

export class DispensingPointDto {
    @ApiProperty()
    id!: string;

    @ApiProperty({ enum: Type, default: Type.dispensing_point })
    type: Type = Type.dispensing_point;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    description?: string | null;

    @ApiProperty()
    longitude!: number;

    @ApiProperty()
    latitude!: number;

    @ApiProperty()
    capacity?: number | null;

    @ApiProperty({ type: DispensingPointAddressDto })
    address?: DispensingPointAddressDto;

    @ApiProperty()
    user_id?: string;

    @ApiProperty()
    created_at?: Date;

    @ApiProperty()
    updated_at?: Date;
}
