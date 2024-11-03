import { VerificationDto } from "@dto";
import { Controller, Get, Patch, Body } from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";
import { VerificationServiceLibService } from "@verification-service-lib";

@ApiTags('Verification Endpoints')
@Controller('verification')
export class VerificationController {

    constructor(private readonly verificationService: VerificationServiceLibService) {}

    @Patch('verify')
    verifyUser(@Body() body: VerificationDto) {
        return this.verificationService.verifyUser(body.userId, body.role);
    }
}
