import { CreateRescuePostDto } from '@dto';
import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { RescuePost } from '@prisma/client';

@Injectable()
export class RescuePostMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async create(createRescuePostDto: CreateRescuePostDto): Promise<RescuePost> {
        const result = await this.prisma.rescuePost.create({
            data: {
                ...createRescuePostDto,
                contact_persons: createRescuePostDto.contact_persons as unknown as any[],
            },
        });

        return result;
    }

    async findAll(): Promise<RescuePost[]> {
        const rescuePosts = await this.prisma.rescuePost.findMany({
            orderBy: {
                created_at: 'asc',
            },
        });

        return rescuePosts;
    }
}
