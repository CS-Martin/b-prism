import { RescuePostMongodbLibService } from '@b-prism/rescue-post-mongodb-lib';
import { RescuePostDto, ResponseDto } from '@dto';
import { CreateRescuePostDto } from '@dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RescuePostServiceLibService {
    private readonly logger = new Logger(RescuePostServiceLibService.name);

    constructor(private readonly rescuePostMongodbLibService: RescuePostMongodbLibService) {}

    async create(createRescuePostDto: CreateRescuePostDto): Promise<ResponseDto<RescuePostDto>> {
        this.logger.log('Creating rescue post');

        try {
            const rescuePost: RescuePostDto = await this.rescuePostMongodbLibService.create(createRescuePostDto);

            const response: ResponseDto<RescuePostDto> = new ResponseDto<RescuePostDto>(201, rescuePost);

            return response;
        } catch (error) {
            this.logger.error('Error creating rescue post', error);

            throw new BadRequestException(error);
        }
    }

    async findAll(): Promise<ResponseDto<RescuePostDto[]>> {
        this.logger.log('Fetching all rescue posts');

        try {
            const rescuePosts: RescuePostDto[] = await this.rescuePostMongodbLibService.findAll();

            const response: ResponseDto<RescuePostDto[]> = new ResponseDto<RescuePostDto[]>(200, rescuePosts);

            return response;
        } catch (error) {
            this.logger.error('Error fetching all rescue posts', error);

            throw new BadRequestException('Failed to fetch rescue posts');
        }
    }
}
