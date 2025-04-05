import { RescuePostMongodbLibService } from '@b-prism/rescue-post-mongodb-lib';
import { ContactPersonDto, DemographicsDto, LocationDto, RescuePostDto, ResponseDto } from '@dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { RescuePost } from '@prisma/client';
import { RescuePostServiceAbstractClass } from './rescue-psot-service-lib.abstract';
import { ActivityLogServiceLibService } from '@b-prism/activity-log-service-lib';
@Injectable()
export class RescuePostServiceLibService implements RescuePostServiceAbstractClass {
    private readonly logger = new Logger(RescuePostServiceLibService.name);

    constructor(
        private readonly rescuePostMongodbLibService: RescuePostMongodbLibService,
        private readonly activityLogService: ActivityLogServiceLibService,
    ) {}

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

    async findOne(id: string): Promise<ResponseDto<RescuePostDto>> {
        this.logger.log(`Fetching rescue post with id: ${id}`);

        try {
            const rescuePost: RescuePost | null = await this.rescuePostMongodbLibService.findOne(id);

            if (!rescuePost || rescuePost === null) {
                this.logger.warn(`Rescue post with id: ${id} not found`);

                throw new BadRequestException('Rescue post not found');
            }

            const response: ResponseDto<RescuePostDto> = new ResponseDto<RescuePostDto>(200, this.convertToDto(rescuePost));

            return response;
        } catch (error) {
            this.logger.error(`Error fetching rescue post with id: ${id}`, error);

            throw new BadRequestException('Failed to fetch rescue post');
        }
    }

    async updateStatusToPending(id: string, author: string): Promise<void> {
        this.logger.log(`Updating status to pending for rescue post with id: ${id}`);

        await this.findOne(id);

        try {
            await this.rescuePostMongodbLibService.updateStatusToPending(id);

            await this.activityLogService.create({
                action: 'UPDATE',
                description: `Updated status to pending for rescue post with id: ${id}`,
                resource: 'RescuePost',
                resource_id: id,
                author: author,
                timestamp: new Date(),
            });
        } catch (error) {
            this.logger.error(`Error updating status to pending for rescue post with id: ${id}`, error);

            throw new BadRequestException('Failed to update status to pending');
        }
    }

    async updateStatusToRescued(id: string, author: string): Promise<void> {
        this.logger.log(`Updating status to rescued for rescue post with id: ${id}`);

        await this.findOne(id);

        try {
            await this.rescuePostMongodbLibService.updateStatustoRescued(id);

            await this.activityLogService.create({
                action: 'UPDATE',
                description: `Updated status to rescued for rescue post with id: ${id}`,
                resource: 'RescuePost',
                resource_id: id,
                author: author,
                timestamp: new Date(),
            });
        } catch (error) {
            this.logger.error(`Error updating status to rescued for rescue post with id: ${id}`, error);

            throw new BadRequestException('Failed to update status to rescued');
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

        rescuePostDto.status = rescuePost.status ?? 0;
        rescuePostDto.number_of_people_affected = rescuePost.number_of_people_affected ?? 0;
        rescuePostDto.created_at = rescuePost.created_at ?? new Date();
        rescuePostDto.updated_at = rescuePost.updated_at ?? new Date();

        return rescuePostDto;
    }
}
