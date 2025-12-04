import express from 'express';
import { completeModule, getModuleBySlug, getModules } from '../controllers/quizController';
import { protect } from '../middleware/authMiddleware';
const router = express.Router();
router.get('/', getModules);
router.get('/:slug', getModuleBySlug);
router.post('/complete', protect, completeModule);
export default router;