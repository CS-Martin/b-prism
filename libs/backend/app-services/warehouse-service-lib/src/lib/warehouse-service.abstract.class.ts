import { CreateWarehouseDto, ResponseDto, WarehouseDto } from '@dto';

export abstract class WarehouseService {
    abstract create(data: CreateWarehouseDto): Promise<ResponseDto<WarehouseDto>>;

    abstract delete(id: string): Promise<void>;
}
