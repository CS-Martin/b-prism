import { CreateUserDto, ResetPasswordDto, ResponseDto, UpdateUserDto, UserDto } from '@dto';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';

class AuthenticationService {
    private API_BASE_URL: string;

    constructor() {
        // Change if production
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_AUTH_SERVICE_API_PORT ?? ''}`;
    }

    public async create(user: CreateUserDto): Promise<UserDto> {
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

            return response.json();
        } catch (error) {
            console.error(error);

            throw error;
        }
    }

    public async update(id: string, user: UpdateUserDto): Promise<UserDto> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/authentication/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error('Authentication Service Error', error);

            throw error;
        }
    }

    public async verify(email: string, password: string): Promise<{ user: UserDto; accessToken: string; refreshToken: string }> {
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
                throw new BadRequestException(error.message || 'Failed to login user');
            }

            const responseJson = await response.json();

            return {
                user: responseJson.body.user,
                accessToken: responseJson.body.accessToken,
                refreshToken: responseJson.body.refreshToken,
            };
        } catch (error) {
            console.error('Authentication Service Error:', error);

            throw error;
        }
    }

    public async findById(id: string): Promise<UserDto> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/authentication/find/${id}`);

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message || 'Failed to find user by id');
            }

            return await response.json();
        } catch (error) {
            console.error('Authentication Service Error:', error);

            throw error;
        }
    }

    public async findByEmail(email: string): Promise<UserDto> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/authentication/find/email/${email}`);

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message || 'Failed to find user by email');
            }

            return await response.json();
        } catch (error) {
            console.error('Authentication Service Error:', error);

            throw error;
        }
    }

    public async resetPassword(email: string, resetPasswordDto: ResetPasswordDto): Promise<ResponseDto<UserDto>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/authentication/reset-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, resetPasswordDto }),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message || 'Failed to find user by email');
            }

            return await response.json();
        } catch (error) {
            console.error('Authentication Service Error:', error);

            throw error;
        }
    }

    public async verifyEmailCode(email: string, code: string): Promise<ResponseDto<boolean>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/authentication/verify-email-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code }),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message || 'Failed to verify email code');
            }

            return response.json();
        } catch (error) {
            console.error('Authentication Service Error:', error);

            throw error;
        }
    }

    public async refreshAccessToken(refreshToken?: string): Promise<string | null> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/authentication/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                console.error('Failed to refresh access token');
                return null;
            }

            const data = await response.json();

            if (!data.newAccessToken) {
                console.error('No new access token found in response');

                throw new BadRequestException('No new Access token found in response.');
            }

            return data.newAccessToken;
        } catch (error) {
            console.error('Error refreshing token:', error);

            throw error;
        }
    }
}

export const authService = new AuthenticationService();
