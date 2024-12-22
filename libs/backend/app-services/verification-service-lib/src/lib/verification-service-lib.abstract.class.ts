export abstract class VerificationServiceAbstractClass {
    abstract verifyUser(userId: string, role: string): Promise<void>;
}
