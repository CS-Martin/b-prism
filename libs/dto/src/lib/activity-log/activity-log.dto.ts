import { ApiProperty } from '@nestjs/swagger';

export class ActivityLogDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    action!: string;

    @ApiProperty()
    description!: string;

    @ApiProperty()
    user_id!: string;
    @ApiProperty()
    created_at!: Date;
}
