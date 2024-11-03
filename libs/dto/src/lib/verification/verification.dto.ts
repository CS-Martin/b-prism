import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "@prisma/client";

export class VerificationDto {

    @ApiProperty()
    userId!: string;

    @ApiProperty({ enum: UserRole })
    role!: UserRole;
    
}
