import { Test } from '@nestjs/testing';
import { MapServiceLibService } from './map-service-lib.service';

describe('MapServiceLibService', () => {
    let service: MapServiceLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [MapServiceLibService],
        }).compile();

        service = module.get(MapServiceLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
