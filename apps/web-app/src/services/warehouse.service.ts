import { CreateWarehouseDto, ResponseDto, UpdateWarehouseDto, WarehouseDto } from '@dto';
import { BadRequestException } from '@nestjs/common';

class WarehouseService {
    private API_BASE_URL: string;

    constructor() {
        // Change if production
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_WAREHOUSE_SERVICE_API_PORT ?? ''}`;
    }

    public async create(data: CreateWarehouseDto, author: string): Promise<WarehouseDto> {
        const payload = {
            data,
            author,
        };

        try {
            const response = await fetch(`${this.API_BASE_URL}/warehouse/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to create warehouse');
        }
    }

    public async update(id: string, data: UpdateWarehouseDto, author: string): Promise<WarehouseDto> {
        const payload = { id, data, author };
        try {
            const response = await fetch(`${this.API_BASE_URL}/warehouse/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to update warehouse');
        }
    }

    public async delete(id: string, author: string): Promise<void> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/warehouse/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Author': author,
                },
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to delete warehouse');
        }
    }

    public async fetchAllWarehouses(): Promise<ResponseDto<WarehouseDto[]>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/warehouse`);

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to fetch warehouses');
        }
    }

    public async findOne(id: string): Promise<ResponseDto<WarehouseDto>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/warehouse/${id}`);

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to find warehouse');
        }
    }
}

export const warehouseService = new WarehouseService();
