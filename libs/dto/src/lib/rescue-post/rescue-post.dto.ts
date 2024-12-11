import { ApiProperty } from '@nestjs/swagger';
import { ContactPersonsDto } from './contact_persons.dto';

export class RescuePostDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    longitude?: string | null;

    @ApiProperty()
    latitude?: string | null;

    @ApiProperty()
    contact_persons!: ContactPersonsDto[];

    @ApiProperty()
    total_adults!: number;

    @ApiProperty()
    total_children!: number;

    @ApiProperty()
    total_elderly!: number;

    @ApiProperty()
    number_of_people_affected!: number;

    @ApiProperty()
    createdAt!: Date;

    @ApiProperty()
    updatedAt!: Date;
}
