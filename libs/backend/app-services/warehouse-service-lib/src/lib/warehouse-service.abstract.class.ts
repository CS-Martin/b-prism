import { CreateWarehouseDto, ResponseDto, UpdateWarehouseDto, WarehouseDto } from '@dto';
import { Warehouse } from '@prisma/client';

export abstract class WarehouseServiceAbstractClass {
    abstract create(data: CreateWarehouseDto): Promise<ResponseDto<WarehouseDto>>;

    abstract update(id: string, data: UpdateWarehouseDto): Promise<ResponseDto<WarehouseDto>>;

    abstract delete(id: string): Promise<void>;

    abstract findAll(): Promise<ResponseDto<WarehouseDto[]>>;

    abstract findById(id: string): Promise<ResponseDto<WarehouseDto>>;

    abstract convertToDto(warehouse: Warehouse): WarehouseDto;
}
