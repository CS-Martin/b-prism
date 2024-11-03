import { Test } from '@nestjs/testing';
import { UserMongodbLibService } from './user-mongodb-lib.service';

describe('UserMongodbLibService', () => {
    let service: UserMongodbLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserMongodbLibService],
        }).compile();

        service = module.get(UserMongodbLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
