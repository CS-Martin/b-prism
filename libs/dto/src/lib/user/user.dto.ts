import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserDto {

    @ApiProperty()
    id!: string;

    @ApiProperty()
    given_name!: string;

    @ApiProperty()
    family_name!: string;

    @ApiProperty()
    email!: string;
    
    @ApiProperty()
    password!: string;

    @ApiProperty()
    office?: string | null;

    @ApiProperty()
    position?: string | null;

    @ApiProperty({ enum: UserRole })
    role!: UserRole;

    @ApiProperty()
    id_image_url?: string | null;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;

}
