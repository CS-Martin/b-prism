import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DispensingPointService } from './dispensing-point.abstract.class';
import { DispensingPointMongodbLibService } from '@b-prism/dispensing-point-mongodb-lib';
import {
    CreateDispensingPointDto,
    DispensingPointAddressDto,
    DispensingPointDto,
    ResponseDto,
    UpdateDispensingPointDto,
} from '@dto';
import { DispensingPoint } from '@prisma/client';

@Injectable()
export class DispensingPointServiceLibService implements DispensingPointService {
    private readonly logger = new Logger(DispensingPointServiceLibService.name);

    constructor(private readonly dispensingPointMongodbService: DispensingPointMongodbLibService) {}

    async create(data: CreateDispensingPointDto): Promise<ResponseDto<DispensingPointDto>> {
        this.logger.log('Creating dispensing point', data);

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

            const response: ResponseDto<DispensingPointDto> = new ResponseDto<DispensingPointDto>(
                201,
                this.convertToDto(dispensingPoint),
            );

            return response;
        } catch (error) {
            console.log(error);

            throw new BadRequestException(error);
        }
    }

    async update(id: string, data: UpdateDispensingPointDto): Promise<ResponseDto<DispensingPointDto>> {
        this.logger.log('Updating dispensing point', id);

        try {
            const dispensingPoint = await this.dispensingPointMongodbService.update(id, data);

            const response: ResponseDto<DispensingPointDto> = new ResponseDto<DispensingPointDto>(
                200,
                this.convertToDto(dispensingPoint),
            );

            return response;
        } catch (error) {
            console.log(error);

            throw new BadRequestException(error);
        }
    }

    async delete(id: string): Promise<void> {
        this.logger.log('Deleting dispensing point', id);

        await this.findById(id);

        try {
            await this.dispensingPointMongodbService.delete(id);
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

            const response: ResponseDto<DispensingPointDto> = new ResponseDto<DispensingPointDto>(
                200,
                this.convertToDto(dispensingPoint),
            );

            return response;
        } catch (error) {
            console.log(error);

            throw new BadRequestException(error);
        }
    }

    convertToDto(dispensingPoint: DispensingPoint): DispensingPointDto {
        const dispensingPointDto: DispensingPointDto = {
            id: dispensingPoint.id ?? '',
            type: dispensingPoint.type ?? 'dispensing_point',
            name: dispensingPoint.name ?? '',
            longitude: dispensingPoint.longitude ?? '',
            latitude: dispensingPoint.latitude ?? '',
            description: dispensingPoint.description ?? '',
            address: dispensingPoint.address as DispensingPointAddressDto,
            capacity: dispensingPoint.capacity ?? undefined,
            user_id: dispensingPoint.user_id ?? '',
            created_at: dispensingPoint.created_at,
            updated_at: dispensingPoint.updated_at,
        };

        return dispensingPointDto;
    }
}
