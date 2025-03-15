import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword);
}

export async function isRefreshTokenExpired(refreshToken: string): Promise<boolean> {
    try {
        const decoded = jwt.decode(refreshToken) as { exp?: number };

        if (!decoded || !decoded.exp) {
            return true; // Assume expired if no exp claim
        }

        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        return decoded.exp < now; // True if expired
    } catch (error) {
        console.error('Error decoding refresh token:', error);

        return true;
    }
}
