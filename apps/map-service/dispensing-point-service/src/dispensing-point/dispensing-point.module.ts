import { Module } from '@nestjs/common';
import { DispensingPointController } from './dispensing-point.controller';
import { DispensingPointServiceLibModule } from '@b-prism/dispensing-point-service-lib';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [DispensingPointServiceLibModule, ConfigModule],
    controllers: [DispensingPointController],
})
export class DispensingPointModule {}
