import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RoleModule } from '../role/role.module';

@Module({
    imports: [RoleModule],
    controllers: [AppController],
})
export class AppModule {}
