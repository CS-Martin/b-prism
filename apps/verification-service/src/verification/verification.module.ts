import { VerificationServiceLibModule } from '@verification-service-lib';
import { VerificationController } from './verification.controller';
import { Module } from '@nestjs/common';

@Module({
    imports: [VerificationServiceLibModule],
    controllers: [VerificationController],
})
export class VerificationModule {}
