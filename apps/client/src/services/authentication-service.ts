import { CreateUserDto, UserDto } from "@dto";
import { BadRequestException } from "@nestjs/common";

class AuthenticationService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = process.env.API_BASE_URL ?? '';
    }

    public async create(user: CreateUserDto): Promise<UserDto> {

        // Check if user already exists
        const existingUser = await this.findById(user.sid);

        if (existingUser) {
            throw new BadRequestException('User already exists');
        }

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

    public async findById(id: string): Promise<UserDto> {
        const response = await fetch(`${this.API_BASE_URL}/authentication/find/${id}`);

        if (!response.ok) {
            const error = await response.json();

            throw new BadRequestException(error.message);
        }

        return await response.json();
    }
}

export const authenticationService = new AuthenticationService();