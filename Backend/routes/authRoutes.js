import express from 'express';
import { registerUser } from '../../controllers/authController.js';
import { upload } from '../middlewares/uploadMiddleware.js';

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

export default router;
