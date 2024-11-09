import { CreateWarehouseDto, ResponseDto, WarehouseDto } from '@dto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { WarehouseService } from './warehouse-service.abstract.class';
import { WarehouseMongodbLibService } from '@b-prism/warehouse-mongodb-lib';

@Injectable()
export class WarehouseServiceLibService implements WarehouseService {
    private readonly logger = new Logger(WarehouseServiceLibService.name);

    constructor(private readonly warehouseMongodbService: WarehouseMongodbLibService) {}

    async create(data: CreateWarehouseDto): Promise<ResponseDto<WarehouseDto>> {
        this.logger.log('Creating warehouse', data);

        try {
            const warehouse = await this.warehouseMongodbService.create(data);

            const response: ResponseDto<WarehouseDto> = new ResponseDto<WarehouseDto>(201, warehouse as WarehouseDto);

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

            const response: ResponseDto<WarehouseDto[]> = new ResponseDto<WarehouseDto[]>(
                200,
                warehouses as WarehouseDto[],
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

            const response: ResponseDto<WarehouseDto> = new ResponseDto<WarehouseDto>(200, warehouse as WarehouseDto);

            return response;
        } catch (error) {
            this.logger.log('Error finding warehouse by id', error);

            throw new BadRequestException(error);
        }
    }
}
