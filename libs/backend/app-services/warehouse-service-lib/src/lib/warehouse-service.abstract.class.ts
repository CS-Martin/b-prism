import { CreateWarehouseDto, ResponseDto, UpdateWarehouseDto, WarehouseDto } from '@dto';
import { Warehouse } from '@prisma/client';

export abstract class WarehouseServiceAbstractClass {
    abstract create(data: CreateWarehouseDto, author: string): Promise<ResponseDto<WarehouseDto>>;

    abstract update(id: string, data: UpdateWarehouseDto, author: string): Promise<ResponseDto<WarehouseDto>>;

    abstract delete(id: string, author: string): Promise<void>;

    abstract findAll(): Promise<ResponseDto<WarehouseDto[]>>;

    abstract findById(id: string): Promise<ResponseDto<WarehouseDto>>;

    abstract convertToDto(warehouse: Warehouse): WarehouseDto;
}
