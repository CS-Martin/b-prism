import { CreateRescuePostDto, RescuePostDto, ResponseDto } from '@dto';
import { RescuePost } from '@prisma/client';

export abstract class RescuePostServiceAbstractClass {
    abstract create(createRescuePostDto: CreateRescuePostDto): Promise<ResponseDto<RescuePostDto>>;

    abstract findAll(): Promise<ResponseDto<RescuePostDto[]>>;

    abstract convertToDto(rescuePost: RescuePost): RescuePostDto;
}
