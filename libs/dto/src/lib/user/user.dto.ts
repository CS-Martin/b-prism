import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { LoginProvider } from '@b-prism/types';

export class UserDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    provider!: LoginProvider;

    @ApiProperty()
    given_name!: string;

    @ApiProperty()
    family_name!: string;

    @ApiProperty()
    email!: string;

    @ApiProperty()
    password?: string;

    @ApiProperty()
    office?: string | null;

    @ApiProperty()
    position?: string | null;

    @ApiProperty({ enum: UserRole })
    role!: UserRole;

    @ApiProperty()
    id_image_url?: string | null;

    @ApiProperty()
    refresh_token?: string | null;

    @ApiProperty()
    created_at!: Date;

    @ApiProperty()
    updated_at?: Date;
}
