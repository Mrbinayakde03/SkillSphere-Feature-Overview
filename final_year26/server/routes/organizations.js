import express from 'express';
import {
  createOrganization,
  getOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization,
  requestToJoin,
  manageMemberRequest,
  verifyOrganization,
  getOrganizationAnalytics
} from '../controllers/organizationController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  createOrganizationValidation,
  manageMemberRequestValidation
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getOrganizations);
router.get('/:id', getOrganizationById);

// Private routes
router.use(authenticate);

// Organization creation and management
router.post('/', createOrganizationValidation, createOrganization);
router.put('/:id', updateOrganization);
router.delete('/:id', authorize('admin'), deleteOrganization);

// Member management
router.post('/:id/join', requestToJoin);
router.put('/:id/members/:userId', manageMemberRequestValidation, manageMemberRequest);

// Analytics and verification
router.get('/:id/analytics', getOrganizationAnalytics);
router.put('/:id/verify', authorize('admin'), verifyOrganization);

export default router;
