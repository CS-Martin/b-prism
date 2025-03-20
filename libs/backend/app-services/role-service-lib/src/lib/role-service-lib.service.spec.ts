import { Test } from '@nestjs/testing';
import { RoleServiceLibService } from './role-service-lib.service';

describe('RoleServiceLibService', () => {
    let service: RoleServiceLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [RoleServiceLibService],
        }).compile();

        service = module.get(RoleServiceLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
