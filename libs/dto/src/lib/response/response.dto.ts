import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
    readonly body: T;

    @ApiProperty()
    statusCode!: number;

    constructor(statusCode: number, body: T) {
        this.statusCode = statusCode;
        this.body = body;
    }
}
