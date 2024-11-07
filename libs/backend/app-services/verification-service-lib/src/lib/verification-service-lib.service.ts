import { Injectable } from '@nestjs/common';
import { VerificationServiceLibAbstract } from './verification-service-lib.abstract.class';
import { UserServiceLibService } from '@b-prism/user-service-lib';
import { VerificationMongodbLibService } from '@b-prism/verification-mongodb-lib';

@Injectable()
export class VerificationServiceLibService
    implements VerificationServiceLibAbstract
{
    constructor(
        private readonly userService: UserServiceLibService,
        private readonly verificationMongodbLib: VerificationMongodbLibService,
    ) {}

    async verifyUser(userId: string, role: string): Promise<void> {
        if (!userId || !role) {
            throw new Error('Invalid user ID or role');
        }
        console.log('THIS IS THE USER', role);

        const user = await this.userService.findById(userId);

        try {
            switch (role) {
                case 'admin':
                    await this.verificationMongodbLib.makeAdmin(user.body);
                    break;
                case 'verified':
                    await this.verificationMongodbLib.verifyUser(user.body);
                    break;
                case 'unverified':
                    await this.verificationMongodbLib.unverifyUser(user.body);
                    break;
                default:
                    throw new Error('Invalid role');
            }
        } catch (error) {
            console.log(error);

            throw new Error('Failed to verify user');
        }
    }
}
