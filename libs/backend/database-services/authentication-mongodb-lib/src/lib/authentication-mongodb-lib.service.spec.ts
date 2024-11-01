import { Test } from '@nestjs/testing';
import { AuthenticationMongodbLibService } from './authentication-mongodb-lib.service';

describe('AuthenticationMongodbLibService', () => {
    let service: AuthenticationMongodbLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [AuthenticationMongodbLibService],
        }).compile();

        service = module.get(AuthenticationMongodbLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
