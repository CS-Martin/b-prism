import { CreateRescuePostDto, RescuePostDto, ResponseDto } from '@dto';

export abstract class RescuePostServiceAbstractClass {
    abstract create(createRescuePostDto: CreateRescuePostDto): Promise<ResponseDto<RescuePostDto>>;
}
