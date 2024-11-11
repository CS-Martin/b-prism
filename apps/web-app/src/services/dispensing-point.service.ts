import { CreateDispensingPointDto, DispensingPointDto, ResponseDto } from '@dto';
import { BadRequestException } from '@nestjs/common';

class DispensingPointService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${
            process.env.NEXT_PUBLIC_DISPENSING_POINT_SERVICE_API_PORT ?? ''
        }`;
    }

    public async create(dispensingPoint: CreateDispensingPointDto): Promise<DispensingPointDto> {
        console.log(dispensingPoint);
        try {
            const response = await fetch(`${this.API_BASE_URL}/dispensing-point/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dispensingPoint),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to create dispensing point');
        }
    }

    public async delete(id: string): Promise<void> {
        console.log('id', id);
        try {
            const response = await fetch(`${this.API_BASE_URL}/dispensing-point/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to delete dispensing point');
        }
    }

    public async fetchAllDispensingPoints(): Promise<ResponseDto<DispensingPointDto[]>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/dispensing-point`);

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to fetch all dispensing points');
        }
    }
}

export const dispensingPointService = new DispensingPointService();
