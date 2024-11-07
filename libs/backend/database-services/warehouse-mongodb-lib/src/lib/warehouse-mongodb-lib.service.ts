import { CreateWarehouseDto, WarehouseDto } from '@dto';
import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { Warehouse } from '@prisma/client';

@Injectable()
export class WarehouseMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async create(data: CreateWarehouseDto): Promise<Warehouse> {
        const warehouse = this.prisma.warehouse.create({
            data: {
                ...data,
                description: data.description ?? '',
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
}
