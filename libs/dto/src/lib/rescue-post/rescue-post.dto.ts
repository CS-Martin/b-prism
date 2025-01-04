import { ApiProperty } from '@nestjs/swagger';
import { ContactPersonDto } from './contact-person.dto';

export class RescuePostDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    longitude?: string | null;

    @ApiProperty()
    latitude?: string | null;

    @ApiProperty({ type: [ContactPersonDto] })
    contact_persons!: ContactPersonDto[];

    @ApiProperty()
    total_adults!: number;

    @ApiProperty()
    total_children!: number;

    @ApiProperty()
    total_elderly!: number;

    @ApiProperty()
    number_of_people_affected!: number;

    @ApiProperty()
    address!: string | null;

    @ApiProperty()
    landmark!: string | null;

    @ApiProperty()
    created_at!: Date;

    @ApiProperty()
    updated_at!: Date;
}
