import { ActivityLogServiceLibService } from '@b-prism/activity-log-service-lib';
import { RoadNetworkMongodbLibService } from '@b-prism/road-network-mongodb-lib';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RoadNetworkServiceAbstractClass } from './road-network-service-lib.abstract.class';
import { ResponseDto, RoadNetworkDto, RoadNetworkPropertyDto } from '@dto';
import { RoadNetwork } from '@prisma/client';

@Injectable()
export class RoadNetworkServiceLibService implements RoadNetworkServiceAbstractClass {
    private readonly logger = new Logger(RoadNetworkServiceLibService.name);

    constructor(
        private readonly roadNetworkMongodbService: RoadNetworkMongodbLibService,
        private readonly activityLogService: ActivityLogServiceLibService,
    ) {}

    async findById(roadId: string): Promise<ResponseDto<RoadNetworkDto>> {
        this.logger.log('Finding road by ID, ', roadId);

        try {
            const road = await this.roadNetworkMongodbService.findById(roadId);

            if (!road) {
                this.logger.error(`Couldn't find road with id ${roadId}. Please try again.`);

                throw new NotFoundException(`Couldn't find road with id ${roadId}. Please try again.`);
            }

            const response: ResponseDto<RoadNetworkDto> = new ResponseDto<RoadNetworkDto>(200, this.convertToDto(road));

            return response;
        } catch (error) {
            this.logger.log(`An error occured while finding road by ID:`, roadId);

            throw new BadRequestException(error);
        }
    }

    async destroyRoad(roadId: string): Promise<void> {
        this.logger.log('Destroyinng road, ', roadId);

        await this.findById(roadId);

        try {
            await this.roadNetworkMongodbService.destroyRoad(roadId);
        } catch (error) {
            this.logger.error(`An unkown error occured while destroying road with id,`, roadId);

            throw new BadRequestException(error);
        }
    }

    async fixRoad(roadId: string): Promise<void> {
        this.logger.log('Fixing road with ID, ', roadId);

        await this.findById(roadId);

        try {
            await this.roadNetworkMongodbService.destroyRoad(roadId);
        } catch (error) {
            this.logger.error(`An unkown error occured while destroying road with id,`, roadId);

            throw new BadRequestException(error);
        }
    }

    convertToDto(road: RoadNetwork): RoadNetworkDto {
        const roadDto: RoadNetworkDto = new RoadNetworkDto();

        roadDto.id = road.id;
        roadDto.type = road.type;
        roadDto.status = road.status;
        roadDto.damage_probability = road.damage_probability;
        roadDto.property = road.properties as unknown as JSON;
        roadDto.geometry = road.geometry as unknown as JSON;

        return roadDto;
    }
}
