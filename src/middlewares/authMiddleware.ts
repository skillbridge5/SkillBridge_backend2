
import { Role } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface MyJwtPayload extends JwtPayload {
  id: string;
  role: string;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }

  try {
    const decoded = jwt.verify(token, secret) as MyJwtPayload;
    req.user = {
      id: decoded.id,
      role: decoded.role as Role,
    };
    next();
  } catch (err: any) {
    console.error('JWT error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
