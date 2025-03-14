import { MailerDto, ResponseDto } from '@dto';
import { BadRequestException } from '@nestjs/common';

class MailerService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_MAILER_SERVICE_API_PORT}/${process.env.NEXT_PUBLIC_API_VERSION}`;
    }

    public async sendVerificationCode(email: string): Promise<ResponseDto<MailerDto>> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/mailers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const error = await response.json();

                throw new BadRequestException(error.message || 'Failed to send verification code');
            }

            return response.json();
        } catch (error) {
            console.error('MailerService Error:', error);

            throw error;
        }
    }
}

export const mailerService = new MailerService();
