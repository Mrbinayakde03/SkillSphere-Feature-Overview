import { User } from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @desc Register new user or organizer
// @route POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
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
