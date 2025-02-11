import { MailerDto, ResponseDto } from '@dto';
import { BadRequestException } from '@nestjs/common';

class MailerService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_MAILER_SERVICE_API_PORT ?? ''}`;
    }

    public async sendVerificationCode(email: string): Promise<ResponseDto<MailerDto>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/mailer/upsert`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message);
            }

            return response.json();
        } catch (error) {
            console.error(error);

            throw new BadRequestException(`Failed to send verification code to ${email}`);
        }
    }
}

export const mailerService = new MailerService();
