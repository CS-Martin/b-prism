import { VerificationController } from "./verification.controller";
import { Module } from "@nestjs/common";

@Module({
    controllers: [VerificationController],
})
export class VerificationModule {}
