import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DispensingPointServiceAbstractClass } from './dispensing-point.abstract.class';
import { DispensingPointMongodbLibService } from '@b-prism/dispensing-point-mongodb-lib';
import {
    ActivityLogDto,
    CreateActivityLogDto,
    CreateDispensingPointDto,
    DispensingPointAddressDto,
    DispensingPointDto,
    ResponseDto,
    UpdateDispensingPointDto,
    UserDto,
} from '@dto';
import { DispensingPoint } from '@prisma/client';
import { ActivityLogServiceLibService } from '@b-prism/activity-log-service-lib';

@Injectable()
export class DispensingPointServiceLibService implements DispensingPointServiceAbstractClass {
    private readonly logger = new Logger(DispensingPointServiceLibService.name);

    constructor(
        private readonly dispensingPointMongodbService: DispensingPointMongodbLibService,
        private readonly activityLogService: ActivityLogServiceLibService,
    ) {}

    async create(data: CreateDispensingPointDto, author: string): Promise<ResponseDto<DispensingPointDto>> {
        this.logger.log('Creatinasdasdg dispensing point', data);

        try {
            const dispensingPoint = await this.dispensingPointMongodbService.create({
                name: data.name,
                type: data.type,
                description: data.description,
                longitude: data.longitude,
                latitude: data.latitude,
                capacity: data.capacity,
                user_id: data.user_id,
                address: data.address,
                created_at: new Date(),
                updated_at: new Date(),
            });

            const response: ResponseDto<DispensingPointDto> = new ResponseDto<DispensingPointDto>(201, this.convertToDto(dispensingPoint));

            const logData: CreateActivityLogDto = new CreateActivityLogDto();

            logData.action = 'CREATE';
            logData.description = `Created dispensing point ${dispensingPoint.name}.`;
            logData.resource = 'Dispensing Point';
            logData.resource_id = dispensingPoint.id;
            logData.author = author;
            logData.timestamp = new Date();

            await this.activityLogService.create(logData);

            return response;
        } catch (error) {
            console.log(error);

            throw new BadRequestException(error);
        }
    }

    async update(id: string, data: UpdateDispensingPointDto, author: string): Promise<ResponseDto<DispensingPointDto>> {
        this.logger.log('Updating dispensing point', id, data, author);

        try {
            const dispensingPoint = await this.dispensingPointMongodbService.update(id, {
                ...data,
                updated_at: new Date(),
            });

            const response: ResponseDto<DispensingPointDto> = new ResponseDto<DispensingPointDto>(200, this.convertToDto(dispensingPoint));

            const logData: CreateActivityLogDto = new CreateActivityLogDto();

            logData.action = 'UPDATE';
            logData.description = `Updated dispensing point ${dispensingPoint.name}.`;
            logData.resource = 'Dispensing Point';
            logData.resource_id = dispensingPoint.id;
            logData.author = author;
            logData.timestamp = new Date();

            await this.activityLogService.create(logData);

            return response;
        } catch (error) {
            console.log(error);

            throw new BadRequestException(error);
        }
    }

    async delete(id: string, author: string): Promise<void> {
        this.logger.log('Deleting dispensing point', id);

        const res: ResponseDto<DispensingPointDto> = await this.findById(id);

        const dispensingPoint: DispensingPointDto = res.body;

        try {
            await this.dispensingPointMongodbService.delete(id);

            const logData: CreateActivityLogDto = new CreateActivityLogDto();

            logData.action = 'CREATE';
            logData.description = `Deleted dispensing point ${dispensingPoint.name}.`;
            logData.resource = 'Dispensing Point';
            logData.resource_id = dispensingPoint.id;
            logData.author = author;
            logData.timestamp = new Date();

            await this.activityLogService.create(logData);
        } catch (error) {
            console.log(error);

            throw new BadRequestException(error);
        }
    }

    async findAll(): Promise<ResponseDto<DispensingPointDto[]>> {
        this.logger.log('Finding all dispensing points');

        try {
            const dispensingPoints = await this.dispensingPointMongodbService.findAll();

            const response: ResponseDto<DispensingPointDto[]> = new ResponseDto<DispensingPointDto[]>(
                200,
                dispensingPoints.map((dispensingPoint) => this.convertToDto(dispensingPoint)),
            );

            return response;
        } catch (error) {
            console.log(error);

            throw new BadRequestException(error);
        }
    }

    async findById(id: string): Promise<ResponseDto<DispensingPointDto>> {
        this.logger.log('Finding dispensing point by id', id);

        try {
            const dispensingPoint = await this.dispensingPointMongodbService.findById(id);

            if (!dispensingPoint) {
                throw new NotFoundException('Dispensing point not found');
            }

            const response: ResponseDto<DispensingPointDto> = new ResponseDto<DispensingPointDto>(200, this.convertToDto(dispensingPoint));

            return response;
        } catch (error) {
            console.log(error);

            throw new BadRequestException(error);
        }
    }

    convertToDto(dispensingPoint: DispensingPoint): DispensingPointDto {
        const dispensingPointDto: DispensingPointDto = new DispensingPointDto();

        dispensingPointDto.id = dispensingPoint.id ?? '';
        dispensingPointDto.type = dispensingPoint.type ?? 'dispensing_point';
        dispensingPointDto.name = dispensingPoint.name ?? '';
        dispensingPointDto.longitude = dispensingPoint.longitude ?? '';
        dispensingPointDto.latitude = dispensingPoint.latitude ?? '';
        dispensingPointDto.description = dispensingPoint.description ?? '';
        dispensingPointDto.address = dispensingPoint.address as DispensingPointAddressDto;
        dispensingPointDto.capacity = dispensingPoint.capacity ?? null;
        dispensingPointDto.user_id = dispensingPoint.user_id ?? '';
        dispensingPointDto.created_at = dispensingPoint.created_at;
        dispensingPointDto.updated_at = dispensingPoint.updated_at;

        return dispensingPointDto;
    }
}
