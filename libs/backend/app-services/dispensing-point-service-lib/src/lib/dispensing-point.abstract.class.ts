import { CreateDispensingPointDto, DispensingPointDto, ResponseDto } from '@dto';

export abstract class DispensingPointService {
    abstract create(data: CreateDispensingPointDto): Promise<ResponseDto<DispensingPointDto>>;

    abstract delete(id: string): Promise<void>;

    abstract findAll(): Promise<ResponseDto<DispensingPointDto[]>>;
}
