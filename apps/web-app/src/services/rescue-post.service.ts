import { CreateRescuePostDto, RescuePostDto, ResponseDto } from '@dto';
import { BadRequestException, Body } from '@nestjs/common';

class RescuePostService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_RESCUE_POST_SERVICE_API_PORT}/${process.env.NEXT_PUBLIC_API_VERSION}`;
    }

    public async create(rescuePost: CreateRescuePostDto): Promise<RescuePostDto> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/rescue-posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(rescuePost),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to create rescue post');
        }
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
}

export const rescuePostService = new RescuePostService();
