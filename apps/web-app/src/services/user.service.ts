import { UserDto } from '@dto';
import { BadRequestException } from '@nestjs/common';
import { ResponseDto } from '@dto';

class UserService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_USER_SERVICE_API_PORT}/${process.env.NEXT_PUBLIC_API_VERSION}`;
    }

    public async fetchAllUsers(access_token: string | null): Promise<ResponseDto<UserDto[]>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw error;
        }
    }
}

export const userService = new UserService();
