import { CreateDispensingPointDto, DispensingPointDto } from '@dto';
import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { Type } from '@prisma/client';

@Injectable()
export class DispensingPointMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async create(data: CreateDispensingPointDto): Promise<DispensingPointDto> {
        const dispensingPoint = this.prisma.dispensinPoint.create({
            data: {
                ...data,
                type: 'dispensin_point' as Type,
            },
        });

        return dispensingPoint;
    }

    async delete(id: string): Promise<void> {
        await this.prisma.dispensinPoint.delete({
            where: {
                id,
            },
        });
    }

    async findAll(): Promise<DispensingPointDto[]> {
        const dispensingPoints = await this.prisma.dispensinPoint.findMany();

        return dispensingPoints;
    }

    async findById(id: string): Promise<DispensingPointDto | null> {
        const dispensingPoint = await this.prisma.dispensinPoint.findUnique({
            where: {
                id,
            },
        });

        return dispensingPoint;
    }
}
