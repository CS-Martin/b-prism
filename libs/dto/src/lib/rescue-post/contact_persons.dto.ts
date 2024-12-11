import { ApiProperty } from '@nestjs/swagger';

export class ContactPersonsDto {
    @ApiProperty()
    name!: string;

    @ApiProperty()
    contact!: string;
}
