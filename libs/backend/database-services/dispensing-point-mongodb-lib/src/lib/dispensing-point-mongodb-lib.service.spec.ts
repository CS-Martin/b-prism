import { Test } from '@nestjs/testing';
import { DispensingPointMongodbLibService } from './dispensing-point-mongodb-lib.service';

describe('DispensingPointMongodbLibService', () => {
    let service: DispensingPointMongodbLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [DispensingPointMongodbLibService],
        }).compile();

        service = module.get(DispensingPointMongodbLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
