import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({ example: 'password123' })
    password!: string;

    @ApiProperty({ example: 'password123' })
    confirmPassword!: string;
}
