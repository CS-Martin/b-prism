import { CreateDispensingPointDto, DispensingPointDto, ResponseDto, UpdateDispensingPointDto } from '@dto';
import { BadRequestException } from '@nestjs/common';

class DispensingPointService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_DISPENSING_POINT_SERVICE_API_PORT ?? ''}/${process.env.NEXT_PUBLIC_API_VERSION}`;
    }

    public async create(data: CreateDispensingPointDto, author: string, accessToken: string): Promise<DispensingPointDto> {
        const payload = {
            data,
            author,
        };

        try {
            const response = await fetch(`${this.API_BASE_URL}/dispensing-points`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to create dispensing point';

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
            console.error('Dispensing point creation error:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }

    public async update(id: string, data: UpdateDispensingPointDto, author: string, accessToken: string): Promise<DispensingPointDto> {
        const payload = { id, data, author };

        try {
            const response = await fetch(`${this.API_BASE_URL}/dispensing-points/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to update dispensing point';

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
            console.error('Failed to update dispensing point:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }

    public async delete(id: string, author: string, accessToken: string): Promise<void> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/dispensing-points/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Author': author,
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (!response.ok) {
                let errorMessage = 'Failed to delete dispensing point';

                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    console.error('Error parsing JSON response:', jsonError);
                }

                throw new Error(errorMessage);
            }
        } catch (error: any) {
            console.error('Dispensing point deletion error:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }

    public async fetchAllDispensingPoints(): Promise<ResponseDto<DispensingPointDto[]>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/dispensing-points`);

            if (!response.ok) {
                let errorMessage = 'Failed to fetch all dispensing points';

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
            console.error('Failed to fetch all dispensing points:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }

    public async findOne(id: string): Promise<ResponseDto<DispensingPointDto>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/dispensing-points/${id}`);

            if (!response.ok) {
                let errorMessage = 'Failed to fetch one dispensing point';

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
            console.error('Failed to fetch one dispensing point:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }
}

export const dispensingPointService = new DispensingPointService();
