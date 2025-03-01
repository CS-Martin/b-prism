import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        console.log('INSIDE GUARD', token);

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            console.log('TRYING');
            console.log('JWT SECRET:', process.env['JWT_SECRET']);

            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env['JWT_SECRET'],
            });

            console.log('PAYLOAD~', payload);

            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                console.log('ERROR: TOKEN HAS EXPIRED');
                throw new UnauthorizedException('Token has expired. Please refresh your token.');
            } else if (error instanceof JsonWebTokenError) {
                console.log('INVALID TOKEN');
                throw new ForbiddenException('Invalid token');
            }
            throw new UnauthorizedException('Unauthorized');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }
}
