import { RescuePostMongodbLibService } from '@b-prism/rescue-post-mongodb-lib';
import { ContactPersonDto, DemographicsDto, LocationDto, RescuePostDto, ResponseDto } from '@dto';
import { CreateRescuePostDto } from '@dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RescuePost } from '@prisma/client';
import { RescuePostServiceAbstractClass } from './rescue-psot-service-lib.abstract';
@Injectable()
export class RescuePostServiceLibService implements RescuePostServiceAbstractClass {
    private readonly logger = new Logger(RescuePostServiceLibService.name);

    constructor(private readonly rescuePostMongodbLibService: RescuePostMongodbLibService) {}

    async create(createRescuePostDto: CreateRescuePostDto): Promise<ResponseDto<RescuePostDto>> {
        this.logger.log('Creating rescue post');

        try {
            const rescuePost: RescuePost = await this.rescuePostMongodbLibService.create(createRescuePostDto);

            const response: ResponseDto<RescuePostDto> = new ResponseDto<RescuePostDto>(201, this.convertToDto(rescuePost));

            return response;
        } catch (error) {
            this.logger.error('Error creating rescue post', error);

            throw new BadRequestException(error);
        }
    }

    async findAll(): Promise<ResponseDto<RescuePostDto[]>> {
        this.logger.log('Fetching all rescue posts');

        try {
            const rescue_posts: RescuePost[] = await this.rescuePostMongodbLibService.findAll();

            const response: ResponseDto<RescuePostDto[]> = new ResponseDto<RescuePostDto[]>(
                200,
                rescue_posts.map((rescuePost) => this.convertToDto(rescuePost)),
            );

            return response;
        } catch (error) {
            this.logger.error('Error fetching all rescue posts', error);

            throw new BadRequestException('Failed to fetch rescue posts');
        }
    }

    convertToDto(rescuePost: RescuePost): RescuePostDto {
        const rescuePostDto: RescuePostDto = new RescuePostDto();

        rescuePostDto.id = rescuePost.id;

        rescuePostDto.contact_persons =
            rescuePost.contact_persons.map((contactPerson) => {
                const contactPersonDto: ContactPersonDto = new ContactPersonDto();
                contactPersonDto.name = contactPerson.name;
                contactPersonDto.contact = contactPerson.contact;
                return contactPersonDto;
            }) ?? [];

        const demographicsDto: DemographicsDto = new DemographicsDto();
        demographicsDto.total_adults = rescuePost.demographics?.total_adults ?? 0;
        demographicsDto.total_children = rescuePost.demographics?.total_children ?? 0;
        demographicsDto.total_elderly = rescuePost.demographics?.total_elderly ?? 0;
        rescuePostDto.demographics = demographicsDto;

        const locationDto: LocationDto = new LocationDto();
        locationDto.address = rescuePost.location.address ?? '';
        locationDto.latitude = rescuePost.location.latitude ?? null;
        locationDto.longitude = rescuePost.location.longitude ?? null;
        locationDto.landmark = rescuePost.location.landmark ?? '';
        rescuePostDto.location = locationDto;

        rescuePostDto.isRescued = rescuePost.isRescued ?? false;
        rescuePostDto.created_at = rescuePost.created_at ?? new Date();
        rescuePostDto.updated_at = rescuePost.updated_at ?? new Date();

        return rescuePostDto;
    }
}
