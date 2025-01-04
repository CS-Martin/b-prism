import { Test } from '@nestjs/testing';
import { ActivityLogMongodbLibService } from './activity-log-mongodb-lib.service';

describe('ActivityLogMongodbLibService', () => {
    let service: ActivityLogMongodbLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [ActivityLogMongodbLibService],
        }).compile();

        service = module.get(ActivityLogMongodbLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
