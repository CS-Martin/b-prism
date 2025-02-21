import { ActivityLogServiceLibService } from '@b-prism/activity-log-service-lib';
import { RoadNetworkMongodbLibService } from '@b-prism/road-network-mongodb-lib';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RoadNetworkServiceAbstractClass } from './road-network-service-lib.abstract.class';
import { CreateActivityLogDto, ResponseDto, RoadNetworkDto, RoadNetworkPropertyDto } from '@dto';
import { RoadNetwork } from '@prisma/client';

@Injectable()
export class RoadNetworkServiceLibService implements RoadNetworkServiceAbstractClass {
    private readonly logger = new Logger(RoadNetworkServiceLibService.name);

    constructor(
        private readonly roadNetworkMongodbService: RoadNetworkMongodbLibService,
        private readonly activityLogService: ActivityLogServiceLibService,
    ) {}

    async findByBounds(minLng: number, minLat: number, maxLng: number, maxLat: number): Promise<ResponseDto<RoadNetworkDto[]>> {
        this.logger.log(`Fetching roads within bounds: [${minLng}, ${minLat}] to [${maxLng}, ${maxLat}]`);

        try {
            const roads = await this.roadNetworkMongodbService.findByBounds(minLng, minLat, maxLng, maxLat);

            const response: ResponseDto<RoadNetworkDto[]> = new ResponseDto<RoadNetworkDto[]>(
                200,
                roads.map((road) => this.convertToDto(road)),
            );

            // Why the id is being undefined after converting it into DTO???

            return response;
        } catch (error) {
            this.logger.error(`An error occurred while fetching roads within bounds:`, error);

            throw new BadRequestException(error);
        }
    }

    async findAll(): Promise<ResponseDto<RoadNetworkDto[]>> {
        this.logger.log('Fetching all road networks');

        try {
            const roadNetwork: RoadNetwork[] = await this.roadNetworkMongodbService.findAll();

            const response: ResponseDto<RoadNetworkDto[]> = new ResponseDto<RoadNetworkDto[]>(
                200,
                roadNetwork.map((road) => this.convertToDto(road)),
            );

            return response;
        } catch (error) {
            this.logger.log(`An error occured while fetching all road network`);

            throw new BadRequestException(error);
        }
    }

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

    async destroyRoad(roadId: string, author: string): Promise<void> {
        this.logger.log('Destroyinng road, ', roadId);

        const road = (await this.findById(roadId)).body;

        try {
            if (road.is_damaged === true) {
                this.logger.error(`Request denied. Road ${road} is already damaged.`);

                throw new BadRequestException(`Request denied. Road network is already damaged. Please try again.`);
            }

            await this.roadNetworkMongodbService.destroyRoad(roadId);

            const logData: CreateActivityLogDto = new CreateActivityLogDto();

            logData.action = 'UPDATE';
            logData.description = `Road network with ID ${road.id} has been destroyed manually by ${author}`;
            logData.resource = 'Road Network';
            logData.resource_id = road.id;
            logData.author = author;
            logData.timestamp = new Date();

            await this.activityLogService.create(logData);
        } catch (error) {
            this.logger.error(`An unkown error occured while destroying road with id,`, roadId);

            throw new BadRequestException(error);
        }
    }

    async fixRoad(roadId: string, author: string): Promise<void> {
        this.logger.log('Fixing road with ID, ', roadId);

        const road = (await this.findById(roadId)).body;

        try {
            if (road.is_damaged === false) {
                this.logger.error(`Request denied. Road ${road} is already damaged.`);

                throw new BadRequestException(`Request denied. Road network is already fixed. Please try again.`);
            }

            await this.roadNetworkMongodbService.fixRoad(roadId);

            const logData: CreateActivityLogDto = new CreateActivityLogDto();

            logData.action = 'UPDATE';
            logData.description = `Road network with ID ${road.id} has been fixed by ${author}`;
            logData.resource = 'Road Network';
            logData.resource_id = road.id;
            logData.author = author;
            logData.timestamp = new Date();

            await this.activityLogService.create(logData);
        } catch (error) {
            this.logger.error(`An unkown error occured while destroying road with id,`, roadId);

            throw new BadRequestException(error);
        }
    }

    convertToDto(road: RoadNetwork): RoadNetworkDto {
        const roadDto: RoadNetworkDto = new RoadNetworkDto();

        roadDto.id = road.id;
        roadDto.type = road.type;
        roadDto.is_damaged = road.is_damaged;
        roadDto.damage_probability = road.damage_probability;
        roadDto.properties = road.properties as unknown as JSON;
        roadDto.geometry = road.geometry as unknown as JSON;

        return roadDto;
    }
}
