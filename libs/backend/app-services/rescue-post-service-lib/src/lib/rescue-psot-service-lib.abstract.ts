import { CreateRescuePostDto, RescuePostDto, ResponseDto } from '@dto';
import { RescuePost } from '@prisma/client';

export abstract class RescuePostServiceAbstractClass {
    abstract findAll(): Promise<ResponseDto<RescuePostDto[]>>;

    abstract updateStatusToPending(id: string, author: string): Promise<void>;
    abstract updateStatusToRescued(id: string, author: string): Promise<void>;

    abstract convertToDto(rescuePost: RescuePost): RescuePostDto;
}
