import express from 'express';
import { deductHeart, getProfile, resetProgress, updateXP } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.post('/update-xp', protect, updateXP);
router.post('/deduct-heart', protect, deductHeart);
router.post('/reset-progress', protect, resetProgress);

export default router;