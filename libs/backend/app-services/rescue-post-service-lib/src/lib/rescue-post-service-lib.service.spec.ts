import { Test } from '@nestjs/testing';
import { RescuePostServiceLibService } from './rescue-post-service-lib.service';

describe('RescuePostServiceLibService', () => {
    let service: RescuePostServiceLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [RescuePostServiceLibService],
        }).compile();

        service = module.get(RescuePostServiceLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
