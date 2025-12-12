import express from 'express';
import {
  uploadProfileImageController,
  uploadResumeController,
  uploadOrganizationDocsController,
  uploadEventMediaController,
  deleteFileController
} from '../controllers/uploadController.js';
import { authenticate } from '../middleware/auth.js';
import {
  uploadProfileImage,
  uploadResume,
  uploadDocuments,
  uploadEventMedia
} from '../utils/upload.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// File upload routes
router.post('/profile-image', uploadProfileImage, uploadProfileImageController);
router.post('/resume', uploadResume, uploadResumeController);
router.post('/organization-docs', uploadDocuments, uploadOrganizationDocsController);
router.post('/event-media', uploadEventMedia, uploadEventMediaController);
router.delete('/:filename', deleteFileController);

export default router;
