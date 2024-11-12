import {
    CreateWarehouseDto,
    ResponseDto,
    WarehouseAddressDto,
    WarehouseCapacityDto,
    WarehouseDto,
    WarehouseItemDto,
} from '@dto';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WarehouseService } from './warehouse-service.abstract.class';
import { WarehouseMongodbLibService } from '@b-prism/warehouse-mongodb-lib';
import { Warehouse } from '@prisma/client';

@Injectable()
export class WarehouseServiceLibService implements WarehouseService {
    private readonly logger = new Logger(WarehouseServiceLibService.name);

    constructor(private readonly warehouseMongodbService: WarehouseMongodbLibService) {}

    async create(data: CreateWarehouseDto): Promise<ResponseDto<WarehouseDto>> {
        this.logger.log('Creating warehouse', data);

        try {
            const warehouse: Warehouse = await this.warehouseMongodbService.create(data);

            const warehouseDto: WarehouseDto = this.convertToDto(warehouse);

            const response: ResponseDto<WarehouseDto> = new ResponseDto<WarehouseDto>(201, warehouseDto);

            return response;
        } catch (error) {
            this.logger.log('Error creating warehouse', error);

            throw new BadRequestException(error);
        }
    }

    async delete(id: string): Promise<void> {
        this.logger.log('Deleting warehouse', id);

        await this.warehouseMongodbService.findById(id);

        try {
            await this.warehouseMongodbService.delete(id);
        } catch (error) {
            this.logger.log('Error deleting warehouse', error);

            throw new BadRequestException(error);
        }
    }

    async findAll(): Promise<ResponseDto<WarehouseDto[]>> {
        this.logger.log('Finding all warehouses');

        try {
            const warehouses = await this.warehouseMongodbService.findAll();

            const warehousesDto: WarehouseDto[] = warehouses.map((warehouse) => this.convertToDto(warehouse));

            const response: ResponseDto<WarehouseDto[]> = new ResponseDto<WarehouseDto[]>(200, warehousesDto);

            return response;
        } catch (error) {
            this.logger.log('Error finding all warehouses', error);

            throw new BadRequestException(error);
        }
    }

    async findById(id: string): Promise<ResponseDto<WarehouseDto>> {
        this.logger.log('Finding warehouse by id', id);

        try {
            const warehouse = await this.warehouseMongodbService.findById(id);

            if (!warehouse) {
                throw new NotFoundException('Warehouse not found');
            }

            const warehouseDto: WarehouseDto = this.convertToDto(warehouse);

            const response: ResponseDto<WarehouseDto> = new ResponseDto<WarehouseDto>(200, warehouseDto);

            return response;
        } catch (error) {
            this.logger.log('Error finding warehouse by id', error);

            throw new BadRequestException(error);
        }
    }

    convertToDto(warehouse: Warehouse): WarehouseDto {
        const warehouseDto: WarehouseDto = {
            id: warehouse.id ?? '',
            type: warehouse.type ?? 'warehouse',
            name: warehouse.name ?? '',
            longitude: warehouse.longitude ?? '',
            latitude: warehouse.latitude ?? '',
            address: warehouse.address as WarehouseAddressDto,
            items: warehouse.items as WarehouseItemDto[],
            capacity: warehouse.capacity as WarehouseCapacityDto,
            userId: warehouse.userId ?? '',
            createdAt: warehouse.createdAt ?? new Date(),
            updatedAt: warehouse.updatedAt ?? new Date(),
        };

        return warehouseDto;
    }
}
