import { UserDto } from '@dto';
import { BadRequestException } from '@nestjs/common';
import { ResponseDto } from '@dto';

class UserService {
    private API_BASE_URL: string;

    constructor() {
        // Change if production
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${
            process.env.NEXT_PUBLIC_USER_SERVICE_API_PORT ?? ''
        }`;
    }

    public async fetchAllUsers(): Promise<ResponseDto<UserDto[]>> {
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

    public async fetchUserByEmail(email: string): Promise<ResponseDto<UserDto>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/user/${email}`);

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to fetch user');
        }
    }
}

export const userService = new UserService();
