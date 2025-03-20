import { CreateRoleDto, ResponseDto, RoleDto, UpdateRoleDto } from '@dto';

class RoleService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_ROLE_SERVICE_API_PORT}/${process.env.NEXT_PUBLIC_API_VERSION}`;
    }

    public async create(createRoleDto: CreateRoleDto): Promise<ResponseDto<RoleDto>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/roles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

    public async update(id: string, updateRoleDto: UpdateRoleDto, author: string): Promise<ResponseDto<RoleDto>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/roles/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Author': author,
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

    public async fetchRoleById(roleId: string): Promise<RoleDto> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/roles/${roleId}`);

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

    public async fetchAllRoles(): Promise<ResponseDto<RoleDto[]>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/roles`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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
