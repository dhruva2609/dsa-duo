import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';
import { sanityClient } from '../config/sanity';


export const getModules = async (req: Request, res: Response) => {
  const { language } = req.query;
  try {
    const modules = await prisma.module.findMany({
      where: language ? { language: String(language) } : {},
      include: {
        _count: { select: { questions: true } }
      }
    });

    // Add dynamic Sanity modules for the requested language (Levels 1-10)
    if (language) {
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(level => {
        modules.push({
          id: `sanity-${language}-${level}`,
          title: level === 1 ? `${String(language).toUpperCase()} Fundamentals` :
                 level === 2 ? `${String(language).toUpperCase()} Data Structures` :
                 level === 3 ? `${String(language).toUpperCase()} Sort & Search` :
                 level === 4 ? `${String(language).toUpperCase()} Trees & Recursion` :
                 level === 5 ? `${String(language).toUpperCase()} Hash Maps & Sets` :
                 level === 6 ? `${String(language).toUpperCase()} Heaps & Priority` :
                 level === 7 ? `${String(language).toUpperCase()} Graphs & Networks` :
                 level === 8 ? `${String(language).toUpperCase()} Greedy Algorithms` :
                 level === 9 ? `${String(language).toUpperCase()} Dynamic Programming` :
                 `${String(language).toUpperCase()} THE BOSS LEVEL`,
          slug: `sanity-${language}-${level}`,
          language: String(language),
          difficulty: level === 1 ? 'Easy' : (level < 4 ? 'Medium' : level < 8 ? 'Hard' : level < 10 ? 'Legendary' : 'Extreme'),
          icon: level === 1 ? 'star' : 
                level === 2 ? 'layers' : 
                level === 3 ? 'sort' : 
                level === 4 ? 'tree' : 
                level === 5 ? 'magnify' : 
                level === 6 ? 'chevron-up-circle' : 
                level === 7 ? 'share-variant' :
                level === 8 ? 'trophy' : 
                level === 9 ? 'lightning-bolt' : 'skull',
          createdAt: new Date(),
          updatedAt: new Date()
        } as any);
      });
    }






    res.json(modules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching modules' });
  }
};



export const getModuleBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;
  try {
    // If it's a Sanity module pattern: sanity-{language}-{level}
    if (slug.startsWith('sanity-')) {
      const parts = slug.split('-');
      const language = parts[1];
      const level = parseInt(parts[2]);

      const questions = await sanityClient.fetch(
        `*[_type == "question" && language == $language && level == $level]`,
        { language, level }
      );

      return res.json({
        title: `${language.toUpperCase()} Level ${level}`,
        slug,
        language,
        difficulty: 'Easy',
        questions
      });
    }

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
    let moduleId: string;

    if (slug.startsWith('sanity-')) {
      moduleId = slug;
    } else {
      const module = await prisma.module.findUnique({ where: { slug } });
      if (!module) return res.status(404).json({ message: 'Module not found' });
      moduleId = module.id;
    }

    await prisma.userProgress.upsert({
      where: { userId_moduleId: { userId: req.user!.id, moduleId } },
      update: { completed: true },
      create: { userId: req.user!.id, moduleId, completed: true }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error saving progress' });
  }
};