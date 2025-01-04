import { ApiProperty } from '@nestjs/swagger';

export class ContactPersonDto {
    @ApiProperty()
    name!: string;

    @ApiProperty()
    contact!: string;
}
