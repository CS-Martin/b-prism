import { CreateRescuePostDto } from '@dto';
import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { RescuePost } from '@prisma/client';

@Injectable()
export class RescuePostMongodbLibService {
    constructor(private readonly prisma: PrismaDbLibService) {}

    async findOne(id: string): Promise<RescuePost | null> {
        const rescuePost: RescuePost | null = await this.prisma.rescuePost.findUnique({
            where: { id },
        });

        return rescuePost;
    }

    async updateStatusToPending(id: string): Promise<RescuePost> {
        const rescuePost: RescuePost = await this.prisma.rescuePost.update({
            where: { id },
            data: { status: 1 },
        });

        return rescuePost;
    }

    async updateStatustoRescued(id: string): Promise<RescuePost> {
        const rescuePost: RescuePost = await this.prisma.rescuePost.update({
            where: { id },
            data: { status: 2 },
        });

        return rescuePost;
    }

    async findAll(): Promise<RescuePost[]> {
        const rescuePosts: RescuePost[] = await this.prisma.rescuePost.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });

        return rescuePosts;
    }
}
