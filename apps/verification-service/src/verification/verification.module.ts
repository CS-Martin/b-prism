import { VerificationServiceLibModule } from '@verification-service-lib';
import { VerificationController } from './verification.controller';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [VerificationServiceLibModule, JwtModule],
    controllers: [VerificationController],
})
export class VerificationModule {}
