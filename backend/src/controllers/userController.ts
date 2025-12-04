import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

// GET /api/user/profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        xp: true, 
        hearts: true, 
        streak: true, 
        isPremium: true 
      }
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// PUT /api/user/update-xp
export const updateXP = async (req: AuthRequest, res: Response) => {
  const { xp } = req.body; // Amount to add (e.g., 10 or 20)

  try {
    const user = await prisma.user.update({
      where: { id: req.user?.id },
      data: { xp: { increment: xp } },
    });
    res.json({ xp: user.xp, message: 'XP Updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating XP' });
  }
};

// PUT /api/user/deduct-heart
export const deductHeart = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user?.id } });

    if (user && user.hearts > 0 && !user.isPremium) {
      const updatedUser = await prisma.user.update({
        where: { id: req.user?.id },
        data: { hearts: { decrement: 1 } },
      });
      return res.json({ hearts: updatedUser.hearts });
    }
    
    res.json({ hearts: user?.hearts, message: 'No hearts deducted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deducting heart' });
  }
};