import { ApiProperty } from '@nestjs/swagger';

export class DispensingPointDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    type!: string;
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
    userId?: string;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt?: Date;
}
