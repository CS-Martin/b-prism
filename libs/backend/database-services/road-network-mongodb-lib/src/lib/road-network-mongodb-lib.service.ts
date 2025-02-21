import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { RoadNetwork } from '@prisma/client';
import { find } from 'rxjs';

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
                AND: [{ id: roadId }, { is_damaged: false }],
            },
            data: {
                is_damaged: true,
            },
        });
    }

    async fixRoad(roadId: string): Promise<void> {
        await this.prisma.roadNetwork.updateMany({
            where: {
                AND: [{ id: roadId }, { is_damaged: true }],
            },
            data: {
                is_damaged: false,
            },
        });
    }

    async findById(roadId: string): Promise<RoadNetwork | null> {
        const road = this.prisma.roadNetwork.findUnique({
            where: { id: roadId },
        });

        return road;
    }

    async findAll(): Promise<RoadNetwork[]> {
        return this.prisma.roadNetwork.findMany({
            where: {
                is_damaged: true,
            },
        });
    }

    async findByBounds(minLng: number, minLat: number, maxLng: number, maxLat: number): Promise<RoadNetwork[]> {
        const result = await this.prisma.$runCommandRaw({
            find: 'RoadNetwork',
            filter: {
                'geometry.coordinates': {
                    $geoWithin: {
                        $box: [
                            [minLng, minLat], // Bottom-left corner
                            [maxLng, maxLat], // Top-right corner
                        ],
                    },
                },
            },
        });

        // Explicitly define expected structure
        interface MongoFindResponse {
            cursor?: {
                firstBatch?: any[]; // Use 'any[]' temporarily to map before converting to RoadNetwork[]
            };
        }

        const typedResult = result as MongoFindResponse; // Type assertion

        /**
         * @problem
         * Had to normalize the result because the result isn't what I wanted
         * This is probably because of my query above by using mapboxgl boundaries
         * The result data is shaped like this:
         *
         * @example
         * {
         *  _id: { '$oid': '67b6eaa41b2e1da547cdfa49' }, <-- this is the problem
         *  type: 'Feature',
         *  properties: {
         *  u: 8431349329,
         * }
         *
         * @temporaryfix
         * Normalize the result by changing '_id' into 'id'
         * This solve my issue
         */

        // Convert `_id` to string
        const normalizedResults =
            typedResult.cursor?.firstBatch?.map((doc) => ({
                ...doc,
                id: doc._id?.$oid || doc._id, // Convert _id to string if it exists
            })) ?? [];

        return normalizedResults;
    }
}
