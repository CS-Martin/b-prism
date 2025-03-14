import { VerificationDto } from '@dto';

class RoleChangeService {
    private API_BASE_URL: string;

    constructor() {
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_VERIFICATION_SERVICE_API_PORT}/${process.env.NEXT_PUBLIC_API_VERSION}`;
    }

    public async changeRole(verificationDto: VerificationDto, accessToken: string): Promise<void> {
        try {
            const response = await fetch(`${this.API_BASE_URL}/verifications/verify`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(verificationDto),
            });

            if (!response.ok) {
                const error = await response.json();

                throw error;
            }
        } catch (error) {
            console.error('MailerService Error:', error);

            throw error;
        }
    }
}

export const roleChangeService = new RoleChangeService();
