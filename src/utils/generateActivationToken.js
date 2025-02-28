import jwt from 'jsonwebtoken';
import { env } from './env.js';

export const generateActivationToken = (userId, userEmail) => {
  return jwt.sign({ sub: userId, userEmail }, env('JWT_SECRET'), {
    expiresIn: '1d',
  });
};
