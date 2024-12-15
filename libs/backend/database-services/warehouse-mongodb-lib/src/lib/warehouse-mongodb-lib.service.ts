import { CreateWarehouseDto, UpdateWarehouseDto } from '@dto';
import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { Warehouse, Type } from '@prisma/client';

@Injectable()
export class WarehouseMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async create(data: CreateWarehouseDto): Promise<Warehouse> {
        const warehouse = await this.prisma.warehouse.create({ data });

        return warehouse;
    }

    async update(id: string, data: UpdateWarehouseDto): Promise<Warehouse> {
        const warehouse = await this.prisma.warehouse.update({
            where: { id },
            data: {
                ...data,
                type: 'warehouse' as Type,
            },
        });

        return warehouse;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.warehouse.delete({
            where: {
                id,
            },
        });
    }

    async findAll(): Promise<Warehouse[]> {
        const warehouses = await this.prisma.warehouse.findMany();

        return warehouses;
    }

    async findById(id: string): Promise<Warehouse | null> {
        const warehouse = await this.prisma.warehouse.findUnique({
            where: {
                id,
            },
        });

        return warehouse;
    }
}
