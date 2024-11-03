import { Test } from '@nestjs/testing';
import { VerificationServiceLibService } from './verification-service-lib.service';

describe('VerificationServiceLibService', () => {
    let service: VerificationServiceLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [VerificationServiceLibService],
        }).compile();

        service = module.get(VerificationServiceLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
