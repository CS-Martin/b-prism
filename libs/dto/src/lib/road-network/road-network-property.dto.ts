import { ApiProperty } from '@nestjs/swagger';

export class RoadNetworkPropertyDto {
    @ApiProperty()
    u!: number;

    @ApiProperty()
    v!: number;

    @ApiProperty()
    key!: number;

    @ApiProperty()
    osmid!: number;

    @ApiProperty()
    highway!: string;

    @ApiProperty()
    oneway!: boolean;

    @ApiProperty()
    reversed!: boolean;

    @ApiProperty()
    length!: number;

    @ApiProperty()
    speed_kph!: number;

    @ApiProperty()
    travel_time!: number;

    @ApiProperty()
    from!: string;

    @ApiProperty()
    to!: string;

    @ApiProperty({ required: false, nullable: true })
    lanes?: string | null;

    @ApiProperty({ required: false, nullable: true })
    name?: string | null;

    @ApiProperty({ required: false, nullable: true })
    ref?: string | null;

    @ApiProperty({ required: false, nullable: true })
    bridge?: string | null;

    @ApiProperty({ required: false, nullable: true })
    maxspeed?: string | null;

    @ApiProperty({ required: false, nullable: true })
    access?: string | null;

    @ApiProperty({ required: false, nullable: true })
    width?: string | null;

    @ApiProperty({ required: false, nullable: true })
    junction?: string | null;

    @ApiProperty({ required: false, nullable: true })
    tunnel?: string | null;
}
