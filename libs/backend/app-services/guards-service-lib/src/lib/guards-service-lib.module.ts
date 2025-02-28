import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './jwt-auth.guard';

@Module({
    controllers: [],
    imports: [
        JwtModule.register({
            secret: process.env['JWT_SECRET'],
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [AuthGuard],
    exports: [AuthGuard, JwtModule, GuardsServiceLibModule],
})
export class GuardsServiceLibModule {}
