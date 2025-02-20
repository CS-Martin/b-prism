import { ApiProperty } from '@nestjs/swagger';
import { RoadNetworkPropertyDto } from './road-network-property.dto';
import { RoadNetworkGeometryDto } from './road-network-geometry.dto';

export class RoadNetworkDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    type!: string;

    @ApiProperty({ type: RoadNetworkPropertyDto })
    property!: JSON;

    @ApiProperty({ type: RoadNetworkGeometryDto })
    geometry!: JSON;

    @ApiProperty()
    status!: boolean;

    @ApiProperty()
    damage_probability!: number;
}
