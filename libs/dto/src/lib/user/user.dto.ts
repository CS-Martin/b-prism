import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserDto {

    @ApiProperty()
    id!: string;

    @ApiProperty()
    auth0_id!: string | null;

    @ApiProperty()
    name!: string;

    @ApiProperty()
    office!: string;

    @ApiProperty()
    position!: string;

    @ApiProperty()
    email!: string;

    @ApiProperty()
    password!: string;

    @ApiProperty()
    id_image_url!: string | null;

    @ApiProperty()
    role!: UserRole;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
    
}
