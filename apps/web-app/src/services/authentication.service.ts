import { LoginProvider } from '@b-prism/types';
import { CreateUserDto, PublicUserDto, ResetPasswordDto, ResponseDto, UpdateUserDto, UserDto } from '@dto';
import { BadRequestException } from '@nestjs/common';
import { create } from 'zustand';

class AuthenticationService {
    private API_BASE_URL: string;

    constructor() {
        // Change if production
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_AUTH_SERVICE_API_PORT}/${process.env.NEXT_PUBLIC_API_VERSION}`;
    }

    public async create(user: CreateUserDto): Promise<PublicUserDto> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/users`, {
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
            const response = await fetch(`${this.API_BASE_URL}/auth/users/${id}`, {
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

    public async validateGoogleLogin(createUserDto: CreateUserDto): Promise<{ user: PublicUserDto; access_token: string }> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(createUserDto),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            const responseJson = await response.json();
            return {
                user: responseJson.body.user,
                access_token: responseJson.body.access_token,
            };
        } catch (error) {
            console.error('Authentication Service Error:', error);

            throw error;
        }
    }

    public async validateCredentialLogin(provider: LoginProvider, email: string, password?: string): Promise<{ user: UserDto; access_token: string }> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/credentials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ provider, email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new BadRequestException(error.message || 'Failed to login user');
            }

            const responseJson = await response.json();

            return {
                user: responseJson.body.user,
                access_token: responseJson.body.access_token,
            };
        } catch (error) {
            console.error('Authentication Service Error:', error);

            throw error;
        }
    }

    public async findById(id: string): Promise<UserDto> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/users/${id}`);

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
            const response = await fetch(`${this.API_BASE_URL}/auth/users/${email}`);

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
            const response = await fetch(`${this.API_BASE_URL}/auth/users/reset-password`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, resetPasswordDto }),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message || 'Failed to reset user password');
            }

            return await response.json();
        } catch (error) {
            console.error('Authentication Service Error:', error);

            throw error;
        }
    }

    public async verifyEmailCode(email: string, code: string): Promise<ResponseDto<boolean>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/users/verify-email-code`, {
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

            return await response.json();
        } catch (error) {
            console.error('Authentication Service Error:', error);

            throw error;
        }
    }

    public async refreshAccessToken(refreshToken?: string): Promise<string | null> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/refresh-token`, {
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

    public async findByEmailAndProvider(provider: LoginProvider, email: string): Promise<boolean> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/auth/users?email=${email}&provider=${provider}`);

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message || 'Failed to find existing user');
            }

            return (await response.json()).body;
        } catch (error) {
            console.error('Authentication Service Error:', error);

            throw error;
        }
    }
}

export const authService = new AuthenticationService();
