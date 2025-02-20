import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { RoadNetwork } from '@prisma/client';

@Injectable()
export class RoadNetworkMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    // Road network has more than 70,000 data in the db
    // I need to make use of indexing to make the querying faster

    // In this case, I added index status
    // Use 'status' index when querying to filter the data you only need
    // instead of scanning the entire road network collection

    async destroyRoad(roadId: string): Promise<void> {
        await this.prisma.roadNetwork.updateMany({
            where: {
                AND: [{ id: roadId }, { status: false }],
            },
            data: {
                status: true,
            },
        });
    }

    async fixRoad(roadId: string): Promise<void> {
        await this.prisma.roadNetwork.updateMany({
            where: {
                AND: [{ id: roadId }, { status: true }],
            },
            data: {
                status: false,
            },
        });
    }

    async findById(roadId: string): Promise<RoadNetwork | null> {
        const road = this.prisma.roadNetwork.findUnique({
            where: { id: roadId },
        });

        return road;
    }
}
