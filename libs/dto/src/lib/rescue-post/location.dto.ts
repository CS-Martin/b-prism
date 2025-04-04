import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
    @ApiProperty()
    longitude?: number | null;

    @ApiProperty()
    latitude?: number | null;

    @ApiProperty()
    address?: string;

    @ApiProperty()
    landmark?: string;
}
