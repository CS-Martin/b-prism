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
            // @ts-ignore
            const warehouse: WarehouseDto = await this.warehouseMongodbService.create({
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const response: ResponseDto<WarehouseDto> = new ResponseDto<WarehouseDto>(201, warehouse);

            return response;
        } catch (error) {
            this.logger.log('Error creating warehouse', error);

            throw new BadRequestException(error);
        }
    }

    async delete(id: string): Promise<void> {
        this.logger.log('Deleting warehouse', id);

        try {
            await this.warehouseMongodbService.delete(id);
        } catch (error) {
            this.logger.log('Error deleting warehouse', error);

            throw new BadRequestException(error);
        }
    }
}
