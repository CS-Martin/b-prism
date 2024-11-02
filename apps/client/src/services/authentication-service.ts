import { CreateUserDto, UserDto } from "@dto";
import { BadRequestException } from "@nestjs/common";

class AuthenticationService {
    private API_BASE_URL: string;

    constructor() {
        // Change if production
        this.API_BASE_URL = process.env.NEXT_PUBLIC_DEV_API_BASE_URL ?? '';
    }

    public async create(user: any): Promise<UserDto> {

        try {
            const response = await fetch(`${this.API_BASE_URL}/authentication/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return await response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException('Failed to create user');
        }
    }

    public async verify(email: string, password: string): Promise<UserDto> {

        try {
            const response = await fetch(`${this.API_BASE_URL}/authentication/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return await response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException(
                'Your email or password is incorrect. Please try again.'
            );
        }
    }

    public async findById(id: string): Promise<UserDto> {
        const response = await fetch(`${this.API_BASE_URL}/authentication/find/${id}`);

        if (!response.ok) {
            const error = await response.json();

            throw new BadRequestException(error.message);
        }

        return await response.json();
    }

    public async findByEmail(email: string): Promise<UserDto> {
        const response = await fetch(`${this.API_BASE_URL}/authentication/find/email/${email}`);

        if (!response.ok) {
            const error = await response.json();

            throw new BadRequestException(error.message);
        }

        return await response.json();
    }
}

export const authenticationService = new AuthenticationService();