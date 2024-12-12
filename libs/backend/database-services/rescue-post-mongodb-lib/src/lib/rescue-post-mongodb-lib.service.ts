import { ContactPersonsDto, CreateRescuePostDto, RescuePostDto } from '@dto';
import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';

@Injectable()
export class RescuePostMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async create(createRescuePostDto: CreateRescuePostDto): Promise<RescuePostDto> {
        const result = await this.prisma.rescuePost.create({
            data: {
                ...createRescuePostDto,
                contact_persons: createRescuePostDto.contact_persons as unknown as any[],
            },
        });

        return {
            ...result,
            contact_persons: result.contact_persons as unknown as ContactPersonsDto[],
        };
    }

    async findAll(): Promise<RescuePostDto[]> {
        const rescuePosts = await this.prisma.rescuePost.findMany({
            orderBy: {
                createdAt: 'asc',
            },
        });

        return rescuePosts.map((post) => ({
            ...post,
            contact_persons: post.contact_persons as unknown as ContactPersonsDto[],
        }));
    }
}
