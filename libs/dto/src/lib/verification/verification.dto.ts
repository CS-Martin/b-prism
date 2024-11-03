import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@b-prism/enums";

export class VerificationDto {

    @ApiProperty()
    userId!: string;

    @ApiProperty({ enum: UserRole })
    role!: UserRole;
    
}
