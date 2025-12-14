
import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getMe, 
  updateProfile, 
  changePassword 
} from '../controllers/authController.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Multi-file upload for resume and logo
router.post(
  '/register',
  upload.fields([
    { name: 'resume', maxCount: 1 },
    { name: 'organizationLogo', maxCount: 1 }
  ]),
  registerUser
);

// Public routes
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

export default router;
