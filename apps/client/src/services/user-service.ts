import { UserDto } from "@dto";
import { BadRequestException } from "@nestjs/common";
import { UserRole } from "@prisma/client";

class UserService {
    private API_BASE_URL: string;

    constructor() {
        // Change if production
        this.API_BASE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? '';
    }

    public async findAll(): Promise<UserDto[]> {
        console.log('API_BASE_URL', this.API_BASE_URL);

        try {
            const response = await fetch(`${this.API_BASE_URL}/user/all`);

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to fetch users');
        }
    }
}

export const userService = new UserService();
