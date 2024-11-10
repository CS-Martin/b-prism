import { Test } from '@nestjs/testing';
import { DispensingPointServiceLibService } from './dispensing-point-service-lib.service';

describe('DispensingPointServiceLibService', () => {
    let service: DispensingPointServiceLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [DispensingPointServiceLibService],
        }).compile();

        service = module.get(DispensingPointServiceLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
