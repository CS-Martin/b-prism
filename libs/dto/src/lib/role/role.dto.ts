import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    name!: string;

    @ApiProperty({ required: false })
    description?: string | null;

    @ApiProperty()
    permissions!: string[];

    @ApiProperty({ required: false })
    is_default?: boolean | null;

    @ApiProperty()
    created_by!: string;

    @ApiProperty()
    created_at!: Date;

    @ApiProperty()
    updated_at?: Date;
}
