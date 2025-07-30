import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'capanCapa';

export const createToken = (payload: object): string => {
    return jwt.sign(payload, secretKey, { algorithm: 'HS256', expiresIn: '1h' });
};