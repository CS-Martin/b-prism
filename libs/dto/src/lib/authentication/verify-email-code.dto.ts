import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailCode {
    @ApiProperty()
    email!: string;

    @ApiProperty()
    code!: string;
}
