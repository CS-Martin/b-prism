import { CreateRoleDto, ResponseDto, RoleDto, UpdateRoleDto } from '@dto';

class RoleService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_ROLE_SERVICE_API_PORT}/${process.env.NEXT_PUBLIC_API_VERSION}`;
    }

    public async create(createRoleDto: CreateRoleDto, token: string): Promise<RoleDto> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/roles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(createRoleDto),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to create role';

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
            console.error('Warehouse creation error:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }

    public async update(id: string, updateRoleDto: UpdateRoleDto, author: string, token: string): Promise<ResponseDto<RoleDto>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/roles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Author': author,
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updateRoleDto),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to update role';

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
            console.error('Warehouse creation error:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }

    public async delete(id: string, author: string, token: string): Promise<ResponseDto<RoleDto>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/roles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Author': author,
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                let errorMessage = 'Failed to delete role';

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
            console.error('Warehouse creation error:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }

    public async fetchRoleById(roleId: string, token: string | undefined): Promise<RoleDto> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/roles/${roleId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                let errorMessage = 'Failed to fetch roles';

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
            console.error('Warehouse fetch error:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }

    public async fetchRoleByName(roleName: string | undefined, token: string | undefined): Promise<RoleDto> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/roles/search?name=${roleName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                let errorMessage = 'Failed to fetch roles';

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
            console.error('Warehouse fetch error:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }

    public async fetchAllRoles(token: string): Promise<ResponseDto<RoleDto[]>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/roles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                let errorMessage = 'Failed to fetch roles';

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
            console.error('Warehouse fetch error:', error);

            if (error.name === 'TypeError') {
                throw new Error('Network error: Please check your internet connection and try again.');
            }

            throw new Error(error.message || 'An unknown error occurred.');
        }
    }
}

export const roleService = new RoleService();
