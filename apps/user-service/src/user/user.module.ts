import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserServiceLibModule } from "@b-prism/user-service-lib";

@Module({
    imports: [UserServiceLibModule],
    controllers: [UserController],
})
export class UserModule {}
