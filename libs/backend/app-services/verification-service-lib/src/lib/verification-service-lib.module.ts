import { Module } from '@nestjs/common';
import { VerificationServiceLibService } from './verification-service-lib.service';
import { UserServiceLibModule } from '@b-prism/user-service-lib';
import { VerificationMongodbLibModule } from '@b-prism/verification-mongodb-lib';

@Module({
    controllers: [],
    imports: [UserServiceLibModule, VerificationMongodbLibModule],
    providers: [VerificationServiceLibService],
    exports: [VerificationServiceLibService],
})
export class VerificationServiceLibModule {}
