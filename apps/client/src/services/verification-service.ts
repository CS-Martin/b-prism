import { UserDto } from "@dto"

import { ResponseDto } from "@dto"

class VerificationService {
    private API_BASE_URL: string

    constructor() {
        // Change if production
        this.API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}${process.env.NEXT_PUBLIC_VERIFICATION_SERVICE_API_PORT ?? ''}`
    }

    async roleChange(userId: string, role: string): Promise<ResponseDto<UserDto>> {

        try {
            const response = await fetch(`${this.API_BASE_URL}/verification/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({  userId, role })
            })

            if (!response.ok) {
                const error = await response.json();

                throw new Error(error.message);
            }

            const user = await response.json(); 

            return new ResponseDto<UserDto>(201, user.body);
        } catch (error) {
            console.error(error);

            throw new Error('Failed to verify user');
        }
    }

}

export const verificationService = new VerificationService();