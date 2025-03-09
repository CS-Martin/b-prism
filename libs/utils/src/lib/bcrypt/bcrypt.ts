import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
    const salt = await bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

export async function comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compareSync(password, hashedPassword);
}
