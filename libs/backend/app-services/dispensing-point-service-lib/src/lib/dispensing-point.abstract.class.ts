import { CreateDispensingPointDto, DispensingPointDto, ResponseDto, UpdateDispensingPointDto } from '@dto';
import { DispensingPoint } from '@prisma/client';

export abstract class DispensingPointServiceAbstractClass {
    abstract create(data: CreateDispensingPointDto, author: string): Promise<ResponseDto<DispensingPointDto>>;

    abstract update(id: string, data: UpdateDispensingPointDto, author: string): Promise<ResponseDto<DispensingPointDto>>;

    abstract delete(id: string, author: string): Promise<void>;

    abstract findAll(): Promise<ResponseDto<DispensingPointDto[]>>;

    abstract findById(id: string): Promise<ResponseDto<DispensingPointDto>>;

    abstract convertToDto(dispensingPoint: DispensingPoint): DispensingPointDto;
}
