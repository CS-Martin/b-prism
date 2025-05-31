import { ApiProperty } from '@nestjs/swagger';
import { RoadNetworkPropertyDto } from './road-network-property.dto';
import { RoadNetworkGeometryDto } from './road-network-geometry.dto';

export class RoadNetworkDto {
    @ApiProperty()
    id!: string | number;

    @ApiProperty()
    type!: string;

    @ApiProperty({ type: RoadNetworkPropertyDto })
    properties!: JSON;

    @ApiProperty({ type: RoadNetworkGeometryDto })
    geometry!: JSON;

    @ApiProperty({ required: true })
    is_damaged!: boolean;

    @ApiProperty({ required: true })
    severity!: number;

    @ApiProperty()
    description?: string;
}
