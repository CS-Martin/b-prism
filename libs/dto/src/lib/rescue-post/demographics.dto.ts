import { ApiProperty } from '@nestjs/swagger';

export class DemographicsDto {
    @ApiProperty()
    total_adults!: number;

    @ApiProperty()
    total_children!: number;

    @ApiProperty()
    total_elderly!: number;
}
