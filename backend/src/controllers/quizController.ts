import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const getModules = async (req: Request, res: Response) => {
  try {
    const modules = await prisma.module.findMany({
      include: {
        _count: { select: { questions: true } }
      }
    });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching modules' });
  }
};

export const getModuleBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    const module = await prisma.module.findUnique({
      where: { slug },
      include: { questions: true }
    });
    if (!module) return res.status(404).json({ message: 'Module not found' });
    res.json(module);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quiz' });
  }
};

export const completeModule = async (req: AuthRequest, res: Response) => {
  const { slug } = req.body;
  try {
    const module = await prisma.module.findUnique({ where: { slug } });
    if (!module) return res.status(404).json({ message: 'Module not found' });

    await prisma.userProgress.upsert({
      where: { userId_moduleId: { userId: req.user!.id, moduleId: module.id } },
      update: { completed: true },
      create: { userId: req.user!.id, moduleId: module.id, completed: true }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error saving progress' });
  }
};