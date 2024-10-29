import { AuthenticationServiceLibService } from "@authentication-service-lib";
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Authentication Endpoints')
@Controller('authentication')
export class AuthenticationController {
    constructor(private readonly authenticationService: AuthenticationServiceLibService ) {}

    @Get()
    findAll() {
        return this.authenticationService.findAll();
    }

}
