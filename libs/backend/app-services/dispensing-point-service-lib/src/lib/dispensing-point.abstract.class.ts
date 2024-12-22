import { CreateDispensingPointDto, DispensingPointDto, ResponseDto, UpdateDispensingPointDto } from '@dto';
import { DispensingPoint } from '@prisma/client';

export abstract class DispensingPointService {
    abstract create(data: CreateDispensingPointDto): Promise<ResponseDto<DispensingPointDto>>;

    abstract update(id: string, data: UpdateDispensingPointDto): Promise<ResponseDto<DispensingPointDto>>;

    abstract delete(id: string): Promise<void>;

    abstract findAll(): Promise<ResponseDto<DispensingPointDto[]>>;

    abstract findById(id: string): Promise<ResponseDto<DispensingPointDto>>;

    abstract convertToDto(dispensingPoint: DispensingPoint): DispensingPointDto;
}
