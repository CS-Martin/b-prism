import { CreateDispensingPointDto, UpdateDispensingPointDto } from '@dto';
import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { DispensingPoint, Type } from '@prisma/client';

@Injectable()
export class DispensingPointMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async create(data: CreateDispensingPointDto): Promise<DispensingPoint> {
        const dispensingPoint = this.prisma.dispensingPoint.create({
            data: {
                ...data,
            },
        });

        return dispensingPoint;
    }

    async update(id: string, data: UpdateDispensingPointDto): Promise<DispensingPoint> {
        const dispensingPoint = this.prisma.dispensingPoint.update({
            where: { id },
            data: {
                ...data,
            },
        });

        return dispensingPoint;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.dispensingPoint.delete({
            where: {
                id,
            },
        });
    }

    async findAll(): Promise<DispensingPoint[]> {
        const dispensingPoints = await this.prisma.dispensingPoint.findMany();

        return dispensingPoints;
    }

    async findById(id: string): Promise<DispensingPoint | null> {
        const dispensingPoint = await this.prisma.dispensingPoint.findUnique({
            where: {
                id,
            },
        });

        return dispensingPoint;
    }
}
