export abstract class VerificationServiceLibAbstract {

    abstract verifyUser(userId: string, role: string): Promise<void>;

}
