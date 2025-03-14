import { ResponseDto, RoadNetworkDto } from '@dto';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

class RoadNetworkService {
    private API_BASE_URL;

    constructor() {
        // Change if production
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_ROAD_NETWORK_SERVICE_API_PORT ?? ''}/${process.env.NEXT_PUBLIC_API_VERSION}`;
    }

    public async findAllDamagedRoads(): Promise<RoadNetworkDto[]> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/road-networks/damaged`);

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return (await response.json()).body;
        } catch (error) {
            console.error(error);

            throw error;
        }
    }

    public async findFixRoadByBounds(minLng: number, minLat: number, maxLng: number, maxLat: number): Promise<RoadNetworkDto[]> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/road-networks/bounds/search?minLng=${minLng}&minLat=${minLat}&maxLng=${maxLng}&maxLat=${maxLat}`);

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return (await response.json()).body;
        } catch (error) {
            console.error(error);

            throw error;
        }
    }

    public async destroyRoad(roadId: string, author: string): Promise<void> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/road-networks/${roadId}/destroy`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ author }),
            });

            if (!response.ok) {
                const error = await response.json();

                throw error.message;
            }
        } catch (error) {
            console.error(error);

            throw error;
        }
    }

    public async fixRoad(roadId: string, author: string): Promise<void> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/road-networks/${roadId}/fix`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ author }),
            });

            if (!response.ok) {
                const error = await response.json();

                throw error.message;
            }
        } catch (error) {
            console.error(error);

            throw error;
        }
    }
}

export const roadNetworkService = new RoadNetworkService();
