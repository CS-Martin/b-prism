import { ActivityLogServiceLibService } from '@b-prism/activity-log-service-lib';
import { RoleMongodbLibService } from '@b-prism/role-mongodb-lib';
import { CreateRoleDto, ResponseDto, RoleDto, UpdateRoleDto } from '@dto';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';

@Injectable()
export class RoleServiceLibService {
    private readonly logger = new Logger(RoleServiceLibService.name);

    constructor(
        private readonly roleMongodbService: RoleMongodbLibService,
        private readonly activityLogService: ActivityLogServiceLibService,
    ) {}

    async create(createRoleDto: CreateRoleDto): Promise<ResponseDto<RoleDto>> {
        this.logger.log('Creating role: ', createRoleDto);

        try {
            const role: Role = await this.roleMongodbService.create(createRoleDto);

            const response: ResponseDto<RoleDto> = new ResponseDto<RoleDto>(201, this.convertToRoleDto(role));

            await this.activityLogService.create({
                action: 'CREATE',
                description: `${role.created_by} successfully created role ${role.name}.`,
                resource: 'Role',
                resource_id: role.id,
                author: createRoleDto.created_by,
                timestamp: new Date(),
            });

            return response;
        } catch (error) {
            this.logger.error('Error creating role', error);

            throw new BadRequestException(error);
        }
    }

    async update(id: string, updateRoleDto: UpdateRoleDto, author: string): Promise<ResponseDto<{ message: string }>> {
        this.logger.log('Updating role record: ', updateRoleDto);

        try {
            const updatedRole: Role = await this.roleMongodbService.update(id, updateRoleDto);

            const response: ResponseDto<{ message: string }> = new ResponseDto<{ message: string }>(204, { message: 'Role successfully updated.' });

            await this.activityLogService.create({
                action: 'UPDATE',
                description: `${updatedRole.created_by} successfully updated role ${updatedRole.name}.`,
                resource: 'Role',
                resource_id: updatedRole.id,
                author: author,
                timestamp: new Date(),
            });

            return response;
        } catch (error) {
            this.logger.error('Error updating role', error);

            throw new BadRequestException(error);
        }
    }

    async delete(id: string, author: string): Promise<ResponseDto<{ message: string }>> {
        this.logger.log(`Deleting role with id: `, id);

        const role = await this.findOne(id);

        try {
            await this.roleMongodbService.delete(role);

            const response: ResponseDto<{ message: string }> = new ResponseDto<{ message: string }>(204, { message: 'Role successfully deleted.' });

            await this.activityLogService.create({
                action: 'DELETE',
                description: `Deleted role ${role.name}`,
                resource: 'Role',
                resource_id: role.id,
                author: author,
                timestamp: new Date(),
            });

            return response;
        } catch (error) {
            this.logger.error('Error deleting role', error);

            throw new BadRequestException(error);
        }
    }

    async findOne(id: string): Promise<RoleDto> {
        this.logger.log('Finding role with id: ', id);

        try {
            const role: Role | null = await this.roleMongodbService.findOne(id);

            if (!role) {
                throw new NotFoundException('Role not found.');
            }

            return this.convertToRoleDto(role);
        } catch (error) {
            this.logger.error('Error finding role', error);

            throw new BadRequestException(error);
        }
    }

    async findAll(): Promise<ResponseDto<RoleDto[]>> {
        this.logger.log('Finding all roles');

        try {
            const roles: Role[] | null = await this.roleMongodbService.findAll();

            const response: ResponseDto<RoleDto[]> = new ResponseDto<RoleDto[]>(
                200,
                roles.map((map) => this.convertToRoleDto(map)),
            );

            return response;
        } catch (error) {
            this.logger.error('Error finding all role', error);

            throw new BadRequestException(error);
        }
    }

    async findByName(name: string): Promise<ResponseDto<RoleDto>> {
        this.logger.log('Finding role with name: ', name);

        try {
            const role: Role | null = await this.roleMongodbService.findByName(name);

            if (!role) {
                throw new NotFoundException('Role not found.');
            }

            const response: ResponseDto<RoleDto> = new ResponseDto<RoleDto>(200, this.convertToRoleDto(role));

            return response;
        } catch (error) {
            this.logger.error('Error finding role', error);

            throw new BadRequestException(error);
        }
    }

    convertToRoleDto(role: Role): RoleDto {
        const roleDto: RoleDto = new RoleDto();

        roleDto.id = role.id;
        roleDto.name = role.name;
        roleDto.description = role.description;
        roleDto.permissions = role.permissions;
        roleDto.is_default = role.is_default;
        roleDto.created_by = role.created_by;
        roleDto.created_at = role.created_at;
        roleDto.updated_at = role.updated_at;

        return roleDto;
    }
}
