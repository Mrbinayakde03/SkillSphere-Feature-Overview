import express from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getEventRegistrations,
  manageRegistration,
  getUserEvents,
  getEventAnalytics
} from '../controllers/eventController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  createEventValidation,
  manageRegistrationValidation
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Private routes
router.use(authenticate);

// Event management
router.post('/', authorize('organizer', 'admin'), createEventValidation, createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

// Event registrations
router.post('/:id/register', registerForEvent);
router.delete('/:id/register', cancelRegistration);
router.get('/:id/registrations', getEventRegistrations);
router.put('/:id/registrations/:registrationId', manageRegistrationValidation, manageRegistration);

// User-specific routes
router.get('/user/events', getUserEvents);

// Analytics
router.get('/:id/analytics', getEventAnalytics);

export default router;
