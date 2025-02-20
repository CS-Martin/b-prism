import { ResponseDto, RoadNetworkDto } from '@dto';
import { RoadNetwork } from '@prisma/client';

export abstract class RoadNetworkServiceAbstractClass {
    abstract findById(roadId: string): Promise<ResponseDto<RoadNetworkDto>>;

    abstract destroyRoad(roadId: string): Promise<void>;

    abstract fixRoad(roadId: string): Promise<void>;

    abstract convertToDto(road: RoadNetwork): RoadNetworkDto;
}
