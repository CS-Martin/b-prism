import { RescuePostDto } from '@dto';
import { BadRequestException } from '@nestjs/common';

class RescuePostService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_RESCUE_POST_SERVICE_API_PORT}/${process.env.NEXT_PUBLIC_API_VERSION}`;
    }

    public async findAll(): Promise<RescuePostDto[]> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/rescue-posts`, {
                method: 'GET',
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return (await response.json()).body;
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to fetch rescue posts');
        }
    }

    public async updateRescuePostStatus(rescuePostId: string | undefined, status: 'unattended' | 'pending' | 'rescued' | null, author: string, token: string) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/rescue-posts/${rescuePostId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status,
                    author,
                }),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to fetch rescue posts');
        }
    }
}

export const rescuePostService = new RescuePostService();
