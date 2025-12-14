
import { User } from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// @desc Register new user or organizer
// @route POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
  console.log('📝 Register request received:', JSON.stringify(req.body, null, 2));
  
  console.log('📝 Register request received:', JSON.stringify(req.body, null, 2));
  
  const {
    fullName, email, password, role,
    skills, educationLevel, interests,
    organizationName, organizationType, organizationDescription, officialEmailDomain
  } = req.body;

  try {
    // Check if email exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    const user = new User({
      fullName,
      email,
      password,
      role,
      ...(role === 'user' ? { skills, educationLevel, interests } : {
        organizationName,
        organizationType,
        organizationDescription,
        officialEmailDomain
      }),
      ...(req.files?.resume ? { resume: req.files.resume[0].path } : {}),
      ...(req.files?.organizationLogo ? { organizationLogo: req.files.organizationLogo[0].path } : {})
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc Authenticate user and get token
// @route POST /api/auth/login
// @access Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user email
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      
      res.json({
        success: true,
        data: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          token
        }
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc Get user profile
// @route GET /api/auth/me
// @access Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc Update user profile
// @route PUT /api/auth/profile
// @access Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;
      user.skills = req.body.skills || user.skills;
      user.educationLevel = req.body.educationLevel || user.educationLevel;
      user.interests = req.body.interests || user.interests;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      
      res.json({
        success: true,
        data: {
          id: updatedUser._id,
          fullName: updatedUser.fullName,
          email: updatedUser.email,
          role: updatedUser.role
        }
      });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc Change user password
// @route PUT /api/auth/password
// @access Private
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    
    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();
      
      res.json({
        success: true,
        message: 'Password updated successfully'
      });
    } else {
      res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
