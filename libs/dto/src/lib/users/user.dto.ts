import { ApiProperty } from '@nestjs/swagger';

export class UsersDto {

    @ApiProperty()
    id!: string;

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
    image_url!: string;
    
}
