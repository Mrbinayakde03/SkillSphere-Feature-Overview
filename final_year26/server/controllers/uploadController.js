import User from '../models/User.js';
import {
  uploadProfileImage,
  uploadResume,
  uploadDocuments,
  deleteFile,
  getFileUrl
} from '../utils/upload.js';

// @desc    Upload profile image
// @route   POST /api/upload/profile-image
// @access  Private
export const uploadProfileImageController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user._id);

    // Delete old profile image if exists
    if (user.profileImage) {
      const oldImagePath = user.profileImage.replace('/uploads/', '');
      deleteFile(`uploads/${oldImagePath}`);
    }

    // Update user with new profile image
    const imageUrl = getFileUrl(req, req.file.filename, 'profiles');
    user.profileImage = imageUrl;
    await user.save();

    res.json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: { imageUrl }
    });

  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload resume
// @route   POST /api/upload/resume
// @access  Private
export const uploadResumeController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user._id);

    // Delete old resume if exists
    if (user.resume && user.resume.filePath) {
      const oldResumePath = user.resume.filePath.replace('/uploads/', '');
      deleteFile(`uploads/${oldResumePath}`);
    }

    // Update user with new resume
    const resumeUrl = getFileUrl(req, req.file.filename, 'resumes');
    user.resume = {
      fileName: req.file.originalname,
      filePath: resumeUrl,
      uploadDate: new Date()
    };
    await user.save();

    res.json({
      success: true,
      message: 'Resume uploaded successfully',
      data: { resumeUrl }
    });

  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload organization documents
// @route   POST /api/upload/organization-docs
// @access  Private (Organizer)
export const uploadOrganizationDocsController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Check if user is organizer
    if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only organizers can upload organization documents'
      });
    }

    const documentUrl = getFileUrl(req, req.file.filename, 'documents');

    res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        fileName: req.file.originalname,
        filePath: documentUrl,
        uploadDate: new Date()
      }
    });

  } catch (error) {
    console.error('Upload organization docs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Upload event media
// @route   POST /api/upload/event-media
// @access  Private (Organizer)
export const uploadEventMediaController = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Check if user is organizer
    if (req.user.role !== 'organizer' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only organizers can upload event media'
      });
    }

    const mediaFiles = req.files.map(file => ({
      url: getFileUrl(req, file.filename, 'documents'),
      title: file.originalname,
      fileType: file.mimetype.startsWith('image/') ? 'image' : 'video',
      uploadedAt: new Date()
    }));

    res.json({
      success: true,
      message: 'Media uploaded successfully',
      data: { mediaFiles }
    });

  } catch (error) {
    console.error('Upload event media error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete file
// @route   DELETE /api/upload/:filename
// @access  Private
export const deleteFileController = async (req, res) => {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required'
      });
    }

    // Security check - prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }

    // Check if file exists and belongs to user (basic security)
    const user = await User.findById(req.user._id);
    const fileBelongsToUser = 
      (user.profileImage && user.profileImage.includes(filename)) ||
      (user.resume && user.resume.filePath && user.resume.filePath.includes(filename));

    // Admin can delete any file, others can only delete their own
    if (!fileBelongsToUser && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this file'
      });
    }

    const deleted = deleteFile(`uploads/${filename}`);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Update user record if it's their profile image or resume
    if (user.profileImage && user.profileImage.includes(filename)) {
      user.profileImage = null;
      await user.save();
    }

    if (user.resume && user.resume.filePath && user.resume.filePath.includes(filename)) {
      user.resume = null;
      await user.save();
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
