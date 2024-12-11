import { Module } from '@nestjs/common';

import { RescuePostController } from './rescue-post.controller';
import { RescuePostServiceLibModule } from '@b-prism/rescue-post-service-lib';

@Module({
    imports: [RescuePostServiceLibModule],
    controllers: [RescuePostController],
})
export class RescuePostModule {}
