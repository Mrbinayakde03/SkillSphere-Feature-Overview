
import express from 'express';
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  sendJoinRequest,
  handleJoinRequest,
  getOrganizationMembers,
  getUserOrganizations,
  getUserJoinRequests
} from '../controllers/organizationController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getOrganizations);
router.get('/:id', getOrganizationById);

// Private routes
router.use(authenticate);

// Organization management
router.post('/', createOrganization);
router.get('/:id/members', getOrganizationMembers);
router.put('/:id/requests/:userId', handleJoinRequest);

// User-specific routes
router.get('/user/my-organizations', getUserOrganizations);
router.get('/user/join-requests', getUserJoinRequests);

// Join requests
router.post('/:id/join', sendJoinRequest);

export default router;
