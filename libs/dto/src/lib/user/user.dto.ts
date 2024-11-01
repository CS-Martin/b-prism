import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserDto {

    @ApiProperty()
    sid!: string;

    @ApiProperty()
    sub!: string;

    @ApiProperty()
    given_name!: string;

    @ApiProperty()
    family_name!: string;

    @ApiProperty()
    email!: string;

    @ApiProperty()
    office?: string | null;

    @ApiProperty()
    position?: string | null;

    @ApiProperty()
    role!: UserRole;

    @ApiProperty()
    id_image_url?: string | null;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

}
