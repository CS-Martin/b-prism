import { CreateRoleDto, RoleDto, UpdateRoleDto } from '@dto';
import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { Role } from '@prisma/client';

@Injectable()
export class RoleMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async create(createRoleDto: CreateRoleDto): Promise<Role> {
        return await this.prisma.role.create({
            data: createRoleDto,
        });
    }

    async findAll(): Promise<Role[]> {
        return await this.prisma.role.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });
    }

    async findOne(id: string): Promise<Role | null> {
        return await this.prisma.role.findUnique({
            where: { id },
        });
    }

    async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
        return await this.prisma.role.update({
            where: { id },
            data: updateRoleDto,
        });
    }

    async delete(role: RoleDto): Promise<void> {
        await this.prisma.role.delete({
            where: { id: role.id },
        });
    }

    async findByName(name: string): Promise<Role | null> {
        return await this.prisma.role.findUnique({
            where: { name },
        });
    }
}
