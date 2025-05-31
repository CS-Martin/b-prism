import { ApiProperty } from '@nestjs/swagger';

export class ActivityLogDto {
    @ApiProperty()
    id!: string | number;

    @ApiProperty()
    action!: string;

    @ApiProperty()
    description!: string;

    @ApiProperty()
    resource!: string;

    @ApiProperty()
    resource_id!: string;

    @ApiProperty()
    author!: string;

    @ApiProperty()
    timestamp!: Date;
}
