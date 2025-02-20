import { ApiProperty } from '@nestjs/swagger';

export class RoadNetworkGeometryDto {
    @ApiProperty()
    type!: string;

    @ApiProperty({
        type: [Array],
        description: 'Array of coordinates where each entry is a latitude-longitude pair',
        example: [
            [124.0583146, 11.7751496],
            [124.0577835, 11.7749789],
            [124.0573812, 11.7749343],
            // Additional lat-lon pairs...
        ],
    })
    coordinates!: number[][];
}
