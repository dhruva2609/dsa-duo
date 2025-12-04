import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

// Get Profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { id: true, name: true, email: true, xp: true, hearts: true, streak: true, isPremium: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update XP
export const updateXP = async (req: AuthRequest, res: Response) => {
  const { xp } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: req.user?.id },
      data: { xp: { increment: xp } },
    });
    res.json({ xp: user.xp });
  } catch (error) {
    res.status(500).json({ message: 'Error updating XP' });
  }
};

// Deduct Heart
export const deductHeart = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user?.id } });
    if (user && user.hearts > 0 && !user.isPremium) {
      const updated = await prisma.user.update({
        where: { id: req.user?.id },
        data: { hearts: { decrement: 1 } },
      });
      return res.json({ hearts: updated.hearts });
    }
    res.json({ hearts: user?.hearts });
  } catch (error) {
    res.status(500).json({ message: 'Error updating hearts' });
  }
};