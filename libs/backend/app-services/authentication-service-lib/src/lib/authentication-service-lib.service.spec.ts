import { Test } from '@nestjs/testing';
import { AuthenticationServiceLibService } from './authentication-service-lib.service';

describe('AuthenticationServiceLibService', () => {
    let service: AuthenticationServiceLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [AuthenticationServiceLibService],
        }).compile();

        service = module.get(AuthenticationServiceLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
