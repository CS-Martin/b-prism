import { ApiProperty } from '@nestjs/swagger';
import type { LoginProvider } from '@b-prism/types';

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

    @ApiProperty()
    role!: string;

    @ApiProperty()
    id_image_url?: string | null;

    @ApiProperty()
    refresh_token?: string | null;

    @ApiProperty()
    created_at!: Date;

    @ApiProperty()
    updated_at?: Date;
}
