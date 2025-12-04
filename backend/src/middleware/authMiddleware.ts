import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request to include user ID
export interface AuthRequest extends Request {
  user?: { id: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};