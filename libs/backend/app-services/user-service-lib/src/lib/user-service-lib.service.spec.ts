import { Test } from '@nestjs/testing';
import { UserServiceLibService } from './user-service-lib.service';

describe('UserServiceLibService', () => {
    let service: UserServiceLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserServiceLibService],
        }).compile();

        service = module.get(UserServiceLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
