
import express from 'express';
import {
  createEvent,
  getInterEvents,
  getIntraEvents,
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
import { authenticate } from '../middleware/auth.js';

const router = express.Router();



// Public routes
router.get('/inter', getInterEvents);
router.get('/', getInterEvents); // General events endpoint for frontend
router.get('/:id', getEventById);

// Private routes
router.use(authenticate);

// Event management
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

// Private event routes
router.get('/intra', getIntraEvents);

// Event registrations
router.post('/:id/register', registerForEvent);
router.delete('/:id/register', cancelRegistration);
router.get('/:id/registrations', getEventRegistrations);
router.put('/:id/registrations/:registrationId', manageRegistration);

// User-specific routes
router.get('/user/events', getUserEvents);

// Analytics
router.get('/:id/analytics', getEventAnalytics);

export default router;
