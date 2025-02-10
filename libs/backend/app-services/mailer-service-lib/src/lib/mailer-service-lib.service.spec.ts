import { Test } from '@nestjs/testing';
import { MailerServiceLibService } from './mailer-service-lib.service';

describe('MailerServiceLibService', () => {
    let service: MailerServiceLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [MailerServiceLibService],
        }).compile();

        service = module.get(MailerServiceLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
