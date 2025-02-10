import { ApiProperty } from '@nestjs/swagger';

export class MailerDto {
    @ApiProperty()
    id!: string;

    @ApiProperty()
    code!: string;

    @ApiProperty()
    user_id!: string;

    @ApiProperty()
    expires_at!: Date;

    @ApiProperty()
    created_at!: Date;
}
