import { ResponseDto, RoadNetworkDto } from '@dto';
import { RoadNetwork } from '@prisma/client';

export abstract class RoadNetworkServiceAbstractClass {
    abstract findAllDamagedRoads(): Promise<ResponseDto<RoadNetworkDto[]>>;

    abstract findAll(): Promise<ResponseDto<RoadNetworkDto[]>>;

    abstract findById(roadId: string): Promise<ResponseDto<RoadNetworkDto>>;

    abstract destroyRoad(roadId: string, author: string): Promise<void>;

    abstract fixRoad(roadId: string, author: string): Promise<void>;

    abstract convertToDto(road: RoadNetwork): RoadNetworkDto;
}
