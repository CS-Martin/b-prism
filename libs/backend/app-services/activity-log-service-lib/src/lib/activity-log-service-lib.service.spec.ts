import { Test } from '@nestjs/testing';
import { ActivityLogServiceLibService } from './activity-log-service-lib.service';

describe('ActivityLogServiceLibService', () => {
    let service: ActivityLogServiceLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [ActivityLogServiceLibService],
        }).compile();

        service = module.get(ActivityLogServiceLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
