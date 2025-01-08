import { CreateActivityLogDto, CreateWarehouseDto, ResponseDto, UpdateWarehouseDto, WarehouseAddressDto, WarehouseDto, WarehouseNonFoodItemsDto } from '@dto';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { WarehouseServiceAbstractClass } from './warehouse-service.abstract.class';
import { WarehouseMongodbLibService } from '@b-prism/warehouse-mongodb-lib';
import { Warehouse } from '@prisma/client';
import { ActivityLogServiceLibService } from '@b-prisma/activity-log-service-lib';

@Injectable()
export class WarehouseServiceLibService implements WarehouseServiceAbstractClass {
    private readonly logger = new Logger(WarehouseServiceLibService.name);

    constructor(
        private readonly warehouseMongodbService: WarehouseMongodbLibService,
        private readonly activityLogService: ActivityLogServiceLibService,
    ) {}

    async create(data: CreateWarehouseDto, author: string): Promise<ResponseDto<WarehouseDto>> {
        this.logger.log('Creating warehouse', data);

        try {
            const warehouse: Warehouse = await this.warehouseMongodbService.create({
                type: 'warehouse',
                name: data.name,
                description: data.description ?? '',
                longitude: data.longitude,
                latitude: data.latitude,
                capacity: data.capacity ?? 0,
                cost_of_stockpile: data.cost_of_stockpile ?? 0,
                family_food_packs: data.family_food_packs ?? 0,
                standby_funds: data.standby_funds ?? 0,
                non_food_items: {
                    family_kits: data.non_food_items?.family_kits ?? 0,
                    sleeping_kits: data.non_food_items?.sleeping_kits ?? 0,
                    hygiene_kits: data.non_food_items?.hygiene_kits ?? 0,
                    kitchen_kits: data.non_food_items?.kitchen_kits ?? 0,
                    other_nfis: data.non_food_items?.other_nfis ?? 0,
                },
                address: {
                    locality: data.address?.locality ?? '',
                    place: data.address?.place ?? '',
                    region: data.address?.region ?? '',
                    country: data.address?.country ?? '',
                    street: data.address?.street ?? '',
                    post_code: data.address?.post_code ?? '',
                },
                user_id: data.user_id,
            });

            const response: ResponseDto<WarehouseDto> = new ResponseDto<WarehouseDto>(201, this.convertToDto(warehouse));

            const logData: CreateActivityLogDto = new CreateActivityLogDto();

            logData.action = 'CREATE';
            logData.description = `Created warehouse ${warehouse.name}.`;
            logData.resource = 'Warehouse';
            logData.resource_id = warehouse.id;
            logData.author = author;
            logData.timestamp = new Date();

            await this.activityLogService.create(logData);

            return response;
        } catch (error) {
            this.logger.log('Error creating warehouse', error);

            throw new BadRequestException(error);
        }
    }

    async update(id: string, data: UpdateWarehouseDto, author: string): Promise<ResponseDto<WarehouseDto>> {
        this.logger.log('Updating warehouse', id);

        try {
            const warehouse = await this.warehouseMongodbService.update(id, data);

            const response: ResponseDto<WarehouseDto> = new ResponseDto<WarehouseDto>(200, this.convertToDto(warehouse));

            const logData: CreateActivityLogDto = new CreateActivityLogDto();

            logData.action = 'UPDATE';
            logData.description = `Updated warehouse ${warehouse.name}.`;
            logData.resource = 'Warehouse';
            logData.resource_id = warehouse.id;
            logData.author = author;
            logData.timestamp = new Date();

            await this.activityLogService.create(logData);

            return response;
        } catch (error) {
            this.logger.log('Error updating warehouse', error);

            throw new BadRequestException(error);
        }
    }

    async delete(id: string, author: string): Promise<void> {
        this.logger.log('Deleting warehouse', id);

        const res: ResponseDto<WarehouseDto> = await this.findById(id);

        const warehouse: WarehouseDto = res.body;

        try {
            await this.warehouseMongodbService.delete(id);

            const logData: CreateActivityLogDto = new CreateActivityLogDto();

            logData.action = 'DELETE';
            logData.description = `Deleted dispensing point ${warehouse.name}.`;
            logData.resource = 'Warehouse';
            logData.resource_id = warehouse.id;
            logData.author = author;
            logData.timestamp = new Date();

            await this.activityLogService.create(logData);
        } catch (error) {
            this.logger.log('Error deleting warehouse', error);

            throw new BadRequestException(error);
        }
    }

    async findAll(): Promise<ResponseDto<WarehouseDto[]>> {
        this.logger.log('Finding all warehouses');

        try {
            const warehouses = await this.warehouseMongodbService.findAll();

            const response: ResponseDto<WarehouseDto[]> = new ResponseDto<WarehouseDto[]>(
                200,
                warehouses.map((warehouse) => this.convertToDto(warehouse)),
            );

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

            const response: ResponseDto<WarehouseDto> = new ResponseDto<WarehouseDto>(200, this.convertToDto(warehouse));

            return response;
        } catch (error) {
            this.logger.log('Error finding warehouse by id', error);

            throw new BadRequestException(error);
        }
    }

    convertToDto(warehouse: Warehouse): WarehouseDto {
        const warehouseDto: WarehouseDto = new WarehouseDto();

        warehouseDto.id = warehouse.id ?? '';
        warehouseDto.type = warehouse.type ?? 'warehouse';
        warehouseDto.name = warehouse.name ?? '';
        warehouseDto.description = warehouse.description ?? '';
        warehouseDto.longitude = warehouse.longitude ?? '';
        warehouseDto.latitude = warehouse.latitude ?? '';
        warehouseDto.capacity = warehouse.capacity ?? 0;
        warehouseDto.cost_of_stockpile = warehouse.cost_of_stockpile ?? 0;
        warehouseDto.family_food_packs = warehouse.family_food_packs ?? 0;
        warehouseDto.standby_funds = warehouse.standby_funds ?? 0;
        warehouseDto.non_food_items = warehouse.non_food_items as WarehouseNonFoodItemsDto;
        warehouseDto.address = warehouse.address as WarehouseAddressDto;
        warehouseDto.user_id = warehouse.user_id ?? '';
        warehouseDto.created_at = warehouse.created_at ?? new Date();
        warehouseDto.updated_at = warehouse.updated_at ?? new Date();

        return warehouseDto;
    }
}
