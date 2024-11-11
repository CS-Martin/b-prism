import { Module } from '@nestjs/common';
import { DispensingPointController } from './dispensing-point.controller';
import { DispensingPointServiceLibModule } from '@b-prism/dispensing-point-service-lib';

@Module({
    imports: [DispensingPointServiceLibModule],
    controllers: [DispensingPointController],
})
export class DispensingPointModule {}
