import {
    CreateWarehouseDto,
    ResponseDto,
    UpdateWarehouseDto,
    WarehouseAddressDto,
    WarehouseDto,
    WarehouseNonFoodItemsDto,
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

            const warehouseDto: WarehouseDto = this.convertToDto(warehouse);

            const response: ResponseDto<WarehouseDto> = new ResponseDto<WarehouseDto>(201, warehouseDto);

            return response;
        } catch (error) {
            this.logger.log('Error creating warehouse', error);

            throw new BadRequestException(error);
        }
    }

    async update(id: string, data: UpdateWarehouseDto): Promise<ResponseDto<WarehouseDto>> {
        this.logger.log('Updating warehouse', id);

        try {
            const warehouse = await this.warehouseMongodbService.update(id, data);

            const warehouseDto: WarehouseDto = this.convertToDto(warehouse);

            const response: ResponseDto<WarehouseDto> = new ResponseDto<WarehouseDto>(200, warehouseDto);

            return response;
        } catch (error) {
            this.logger.log('Error updating warehouse', error);

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
            description: warehouse.description ?? '',
            longitude: warehouse.longitude ?? '',
            latitude: warehouse.latitude ?? '',
            capacity: warehouse.capacity ?? 0,
            cost_of_stockpile: warehouse.cost_of_stockpile ?? 0,
            family_food_packs: warehouse.family_food_packs ?? 0,
            standby_funds: warehouse.standby_funds ?? 0,
            non_food_items: warehouse.non_food_items as WarehouseNonFoodItemsDto,
            address: warehouse.address as WarehouseAddressDto,
            user_id: warehouse.user_id ?? '',
            created_at: warehouse.created_at ?? new Date(),
            updated_at: warehouse.updated_at ?? new Date(),
        };

        return warehouseDto;
    }
}
