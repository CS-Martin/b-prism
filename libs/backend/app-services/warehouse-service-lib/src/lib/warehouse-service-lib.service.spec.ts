import { Test } from '@nestjs/testing';
import { WarehouseServiceLibService } from './warehouse-service-lib.service';

describe('WarehouseServiceLibService', () => {
    let service: WarehouseServiceLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [WarehouseServiceLibService],
        }).compile();

        service = module.get(WarehouseServiceLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
