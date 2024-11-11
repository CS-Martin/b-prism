import { ApiProperty } from '@nestjs/swagger';

export class DispensingPointDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    type!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    description!: string | null;

    @ApiProperty()
    longitude!: string;

    @ApiProperty()
    latitude!: string;

    @ApiProperty()
    capacity!: number | null;

    @ApiProperty()
    userId?: string | null;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt?: Date;
}
