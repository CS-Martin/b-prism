import { CreateWarehouseDto, ResponseDto, UpdateWarehouseDto, WarehouseDto } from '@dto';
import { BadRequestException } from '@nestjs/common';

class WarehouseService {
    private API_BASE_URL: string;

    constructor() {
        // Change if production
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_WAREHOUSE_SERVICE_API_PORT ?? ''}/${process.env.NEXT_PUBLIC_API_VERSION}`;
    }

    public async create(data: CreateWarehouseDto, author: string, accessToken: string): Promise<WarehouseDto> {
        const payload = { data, author };

        try {
            const response = await fetch(`${this.API_BASE_URL}/warehouses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to create warehouse';

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    console.error('Error parsing JSON response:', jsonError);
                }

                throw new Error(errorMessage);
            }

            return (await response.json()).body;
        } catch (error: any) {
            console.error('Warehouse creation error:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }

    public async update(id: string, data: UpdateWarehouseDto, author: string, accessToken: string): Promise<WarehouseDto> {
        const payload = { id, data, author };

        try {
            const response = await fetch(`${this.API_BASE_URL}/warehouses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to update warehouse';

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    console.error('Error parsing JSON response:', jsonError);
                }

                throw new Error(errorMessage);
            }

            return response.json();
        } catch (error: any) {
            console.error('Warehouse update error:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }

    public async delete(id: string, author: string, accessToken: string): Promise<void> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/warehouses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Author': author,
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                let errorMessage = 'Failed to delete warehouse';

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    console.error('Error parsing JSON response:', jsonError);
                }

                throw new Error(errorMessage);
            }
        } catch (error: any) {
            console.error('Warehouse deletion error:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }

    public async fetchAllWarehouses(): Promise<ResponseDto<WarehouseDto[]>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/warehouses`);

            if (!response.ok) {
                let errorMessage = 'Failed to fetch all warehouse';

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    console.error('Error parsing JSON response:', jsonError);
                }

                throw new Error(errorMessage);
            }

            return response.json();
        } catch (error: any) {
            console.error('Fetching warehouses error:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }

    public async findOne(id: string): Promise<ResponseDto<WarehouseDto>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/warehouses/${id}`);

            if (!response.ok) {
                let errorMessage = 'Failed to find warehouse';

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    console.error('Error parsing JSON response:', jsonError);
                }

                throw new Error(errorMessage);
            }

            return response.json();
        } catch (error: any) {
            console.error('Fetching warehouse error:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }
}

export const warehouseService = new WarehouseService();
