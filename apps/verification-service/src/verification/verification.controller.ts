import { VerificationDto } from '@dto';
import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VerificationServiceLibService } from '@verification-service-lib';
import { AuthGuard } from 'libs/backend/app-services/guards-service-lib/src/lib/jwt-auth.guard';

@ApiTags('Verification Endpoints')
@UseGuards(AuthGuard)
@Controller('verification')
export class VerificationController {
    constructor(private readonly verificationService: VerificationServiceLibService) {}

    @Patch('verify')
    verifyUser(@Body() body: VerificationDto) {
        return this.verificationService.verifyUser(body.userId, body.role);
    }
}
