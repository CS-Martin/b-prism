import { ApiProperty } from '@nestjs/swagger';

export class DispensingPointAddressDto {
    @ApiProperty()
    street?: string;

    @ApiProperty()
    post_code?: string;

    @ApiProperty()
    locality?: string;

    @ApiProperty()
    place?: string;

    @ApiProperty()
    region?: string;

    @ApiProperty()
    country?: string;

    [key: string]: any;
}
