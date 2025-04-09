import { Module } from '@nestjs/common';

import { RescuePostController } from './rescue-post.controller';
import { RescuePostServiceLibModule } from '@b-prism/rescue-post-service-lib';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [RescuePostServiceLibModule, JwtModule],
    controllers: [RescuePostController],
})
export class RescuePostModule {}
