import express from 'express';
import { deductHeart, getProfile, updateXP } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
const router = express.Router();
router.get('/profile', protect, getProfile);
router.put('/xp', protect, updateXP);
router.put('/heart', protect, deductHeart);
export default router;