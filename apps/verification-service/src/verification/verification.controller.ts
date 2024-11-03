import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Verification Endpoints')
@Controller('verification')
export class VerificationController {

    @Get('find/all')
    findAll() {
        return 'findAll';
    }   
}
