import { Test } from '@nestjs/testing';
import { RescuePostMongodbLibService } from './rescue-post-mongodb-lib.service';

describe('RescuePostMongodbLibService', () => {
    let service: RescuePostMongodbLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [RescuePostMongodbLibService],
        }).compile();

        service = module.get(RescuePostMongodbLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
