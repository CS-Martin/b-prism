import { Test } from '@nestjs/testing';
import { WarehouseMongodbLibService } from './warehouse-mongodb-lib.service';

describe('WarehouseMongodbLibService', () => {
    let service: WarehouseMongodbLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [WarehouseMongodbLibService],
        }).compile();

        service = module.get(WarehouseMongodbLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
