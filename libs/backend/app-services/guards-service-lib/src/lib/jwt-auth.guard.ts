import { CanActivate, ExecutionContext, ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
    private readonly logger = new Logger(AuthGuard.name);

    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            this.logger.warn('No token provided');

            throw new UnauthorizedException();
        }

        try {
            this.logger.debug('Attempting token verification...');

            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env['JWT_SECRET'],
            });

            this.logger.log(`Token verified successfully for user: ${payload?.email || 'Unknown'}`);

            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                this.logger.error('Token has expired', error.stack);

                throw new UnauthorizedException('Token has expired. Please refresh your token.');
            } else if (error instanceof JsonWebTokenError) {
                this.logger.error('Invalid token provided', error.stack);

                throw new ForbiddenException('Invalid token');
            }

            this.logger.error('Authorization failed', error);

            throw new UnauthorizedException('Unauthorized');
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }
}
