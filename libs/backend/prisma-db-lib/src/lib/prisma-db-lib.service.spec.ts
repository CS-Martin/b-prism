import { Test } from '@nestjs/testing';
import { PrismaDbLibService } from './prisma-db-lib.service';

describe('PrismaDbLibService', () => {
    let service: PrismaDbLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [PrismaDbLibService],
        }).compile();

        service = module.get(PrismaDbLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
