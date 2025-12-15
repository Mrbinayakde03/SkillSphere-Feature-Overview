import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadsDir;
    
    if (file.fieldname === 'profileImage') {
      uploadPath = path.join(uploadsDir, 'profiles');
    } else if (file.fieldname === 'resume') {
      uploadPath = path.join(uploadsDir, 'resumes');
    } else if (file.fieldname === 'documents') {
      uploadPath = path.join(uploadsDir, 'documents');
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    profileImage: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    resume: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
  };

  const allowedExts = allowedTypes[file.fieldname] || [];
  
  if (allowedExts.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types for ${file.fieldname}: ${allowedExts.join(', ')}`), false);
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
});

// Middleware functions
export const uploadProfileImage = upload.single('profileImage');
export const uploadResume = upload.single('resume');
export const uploadDocuments = upload.single('documents');

// Multiple file upload for event media
export const uploadEventMedia = upload.array('media', 10);

// File validation helper
export const validateFile = (file, allowedTypes) => {
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!allowedTypes.includes(file.mimetype)) {
    return { 
      valid: false, 
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}` 
    };
  }

  if (file.size > (parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024)) {
    return { valid: false, error: 'File too large' };
  }

  return { valid: true };
};

// File deletion helper
export const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

// Get file URL helper
export const getFileUrl = (req, filename, folder = '') => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const path = folder ? `/${folder}/${filename}` : `/${filename}`;
  return `${baseUrl}/uploads${path}`;
};

export default upload;
