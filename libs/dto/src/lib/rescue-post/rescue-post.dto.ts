import { ApiProperty } from '@nestjs/swagger';
import { ContactPersonDto } from './contact-person.dto';
import { DemographicsDto } from './demographics.dto';
import { LocationDto } from './location.dto';

export class RescuePostDto {
    @ApiProperty()
    id?: string;

    @ApiProperty({ type: [ContactPersonDto] })
    contact_persons!: ContactPersonDto[];

    @ApiProperty({ type: DemographicsDto })
    demographics?: DemographicsDto | null;

    @ApiProperty({ type: LocationDto })
    location!: LocationDto;

    @ApiProperty()
    number_of_people_affected!: number;

    @ApiProperty()
    isRescued!: boolean;

    @ApiProperty()
    created_at!: Date;

    @ApiProperty()
    updated_at!: Date;
}
