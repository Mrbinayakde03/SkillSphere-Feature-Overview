import { body } from 'express-validator';

// Simplified validation for testing
export const registerValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  


  body('role')
    .optional()
    .isIn(['USER', 'ORGANIZATION'])
    .withMessage('Role must be USER or ORGANIZATION')
];

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Organization validations
export const createOrganizationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Organization name is required')
    .isLength({ min: 2 })
    .withMessage('Organization name must be at least 2 characters long'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('type')
    .isIn(['university', 'school', 'club', 'company', 'department'])
    .withMessage('Invalid organization type'),
  
  body('category')
    .isIn(['academic', 'technical', 'cultural', 'sports', 'professional', 'social'])
    .withMessage('Invalid organization category')
];

// Event validations
export const createEventValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Event title is required')
    .isLength({ min: 3 })
    .withMessage('Event title must be at least 3 characters long'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Event description is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  
  body('category')
    .isIn(['Workshop', 'Hackathon', 'Seminar', 'Competition', 'Career Fair', 'Networking', 'Conference'])
    .withMessage('Invalid event category'),
  
  body('type')
    .isIn(['inter', 'intra'])
    .withMessage('Event type must be inter or intra'),
  
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Event date must be in the future');
      }
      return true;
    }),
  
  body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),
  
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Event location is required'),
  
  body('maxParticipants')
    .isInt({ min: 1, max: 10000 })
    .withMessage('Maximum participants must be between 1 and 10,000'),
  
  body('registrationDeadline')
    .isISO8601()
    .withMessage('Please provide a valid registration deadline')
    .custom((value, { req }) => {
      if (new Date(value) >= new Date(req.body.date)) {
        throw new Error('Registration deadline must be before event date');
      }
      return true;
    })
];

// Profile update validations
export const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  
  body('linkedin')
    .optional()
    .isURL()
    .withMessage('Please provide a valid LinkedIn URL'),
  
  body('github')
    .optional()
    .isURL()
    .withMessage('Please provide a valid GitHub URL'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array')
];

// Registration management validations
export const manageRegistrationValidation = [
  body('status')
    .isIn(['approved', 'rejected', 'waitlisted'])
    .withMessage('Status must be approved, rejected, or waitlisted')
];

// Member request management validation
export const manageMemberRequestValidation = [
  body('action')
    .isIn(['approve', 'reject'])
    .withMessage('Action must be approve or reject')
];

// Password change validation
export const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number')
];

// File upload validation
export const fileUploadValidation = [
  body('fileType')
    .isIn(['profileImage', 'resume', 'document'])
    .withMessage('Invalid file type')
];

