import { Test } from '@nestjs/testing';
import { VerificationMongodbLibService } from './verification-mongodb-lib.service';

describe('VerificationMongodbLibService', () => {
    let service: VerificationMongodbLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [VerificationMongodbLibService],
        }).compile();

        service = module.get(VerificationMongodbLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
