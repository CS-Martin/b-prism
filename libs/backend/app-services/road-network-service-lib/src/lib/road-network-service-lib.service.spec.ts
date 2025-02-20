import { Test } from '@nestjs/testing';
import { RoadNetworkServiceLibService } from './road-network-service-lib.service';

describe('RoadNetworkServiceLibService', () => {
    let service: RoadNetworkServiceLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [RoadNetworkServiceLibService],
        }).compile();

        service = module.get(RoadNetworkServiceLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
