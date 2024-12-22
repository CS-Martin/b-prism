import { RescuePostMongodbLibService } from '@b-prism/rescue-post-mongodb-lib';
import { ContactPersonsDto, RescuePostDto, ResponseDto } from '@dto';
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
            const rescue_post: RescuePost = await this.rescuePostMongodbLibService.create(createRescuePostDto);

            const response: ResponseDto<RescuePostDto> = new ResponseDto<RescuePostDto>(201, this.convertToDto(rescue_post));

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
                rescue_posts.map((rescue_post) => this.convertToDto(rescue_post)),
            );

            return response;
        } catch (error) {
            this.logger.error('Error fetching all rescue posts', error);

            throw new BadRequestException('Failed to fetch rescue posts');
        }
    }

    convertToDto(rescuePost: RescuePost): RescuePostDto {
        const rescue_post_dto: RescuePostDto = new RescuePostDto();

        rescue_post_dto.id = rescuePost.id ?? '';
        rescue_post_dto.longitude = rescuePost.longitude ?? '';
        rescue_post_dto.latitude = rescuePost.latitude ?? '';
        rescue_post_dto.contact_persons = rescuePost.contact_persons as unknown as ContactPersonsDto[];
        rescue_post_dto.total_adults = rescuePost.total_adults ?? 0;
        rescue_post_dto.total_children = rescuePost.total_children ?? 0;
        rescue_post_dto.total_elderly = rescuePost.total_elderly ?? 0;
        rescue_post_dto.number_of_people_affected = rescuePost.number_of_people_affected ?? 0;
        rescue_post_dto.address = rescuePost.address ?? '';
        rescue_post_dto.landmark = rescuePost.landmark ?? '';
        rescue_post_dto.created_at = rescuePost.created_at;
        rescue_post_dto.updated_at = rescuePost.updated_at;

        return rescue_post_dto;
    }
}
