import Organization from '../models/Organization.js';
import User from '../models/User.js';
import JoinRequest from '../models/JoinRequest.js';
import Event from '../models/Event.js';

// @desc    Create organization
// @route   POST /api/organizations
// @access  Private (ORGANIZATION role)
export const createOrganization = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if user is ORGANIZATION role
    if (req.user.role !== 'ORGANIZATION') {
      return res.status(403).json({
        success: false,
        message: 'Only organization users can create organizations'
      });
    }

    // Check if user already has an organization
    const existingOrg = await Organization.findOne({ adminUserId: req.user._id });
    if (existingOrg) {
      return res.status(400).json({
        success: false,
        message: 'User already has an organization'
      });
    }

    // Create organization
    const organization = await Organization.create({
      name,
      description,
      adminUserId: req.user._id,
      members: [req.user._id] // Admin is also a member
    });

    // Add organization to user's joinedOrganizations
    req.user.joinedOrganizations.push(organization._id);
    await req.user.save();

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: { organization }
    });

  } catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during organization creation',
      details: error.message
    });
  }
};

// @desc    Get all organizations
// @route   GET /api/organizations
// @access  Public
export const getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find()
      .populate('adminUserId', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { organizations }
    });

  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      details: error.message
    });
  }
};

// @desc    Get organization by ID
// @route   GET /api/organizations/:id
// @access  Public
export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('adminUserId', 'name email')
      .populate('members', 'name email')
      .populate('pendingRequests.userId', 'name email');

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    res.json({
      success: true,
      data: { organization }
    });

  } catch (error) {
    console.error('Get organization by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      details: error.message
    });
  }
};

// @desc    Send join request to organization
// @route   POST /api/organizations/:id/join
// @access  Private (USER role)
export const sendJoinRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user is USER role
    if (req.user.role !== 'USER') {
      return res.status(403).json({
        success: false,
        message: 'Only users can send join requests'
      });
    }

    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    // Check if user is already a member
    if (organization.members.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member'
      });
    }

    // Check if request already exists
    const existingRequest = await JoinRequest.findOne({
      userId: req.user._id,
      organizationId: id
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Join request already exists'
      });
    }

    // Create join request
    const joinRequest = await JoinRequest.create({
      userId: req.user._id,
      organizationId: id,
      status: 'PENDING'
    });

    // Add to organization's pending requests
    organization.pendingRequests.push({
      userId: req.user._id,
      status: 'PENDING'
    });
    await organization.save();

    res.status(201).json({
      success: true,
      message: 'Join request sent successfully',
      data: { joinRequest }
    });

  } catch (error) {
    console.error('Send join request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      details: error.message
    });
  }
};

// @desc    Accept/Reject join request
// @route   PUT /api/organizations/:id/requests/:userId
// @access  Private (Organization Admin only)
export const handleJoinRequest = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { status } = req.body; // 'ACCEPTED' or 'REJECTED'

    const organization = await Organization.findById(id);
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    // Check if user is organization admin
    if (organization.adminUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only organization admin can handle join requests'
      });
    }

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be ACCEPTED or REJECTED'
      });
    }

    // Update join request
    const joinRequest = await JoinRequest.findOneAndUpdate(
      { userId, organizationId: id },
      { status },
      { new: true }
    );

    if (!joinRequest) {
      return res.status(404).json({
        success: false,
        message: 'Join request not found'
      });
    }

    // Update organization's pending requests
    const pendingRequest = organization.pendingRequests.find(
      req => req.userId.toString() === userId
    );
    if (pendingRequest) {
      pendingRequest.status = status;
      await organization.save();
    }

    // If accepted, add user to organization members and user's joinedOrganizations
    if (status === 'ACCEPTED') {
      // Add to organization members
      if (!organization.members.includes(userId)) {
        organization.members.push(userId);
      }
      
      // Remove from pending requests
      organization.pendingRequests = organization.pendingRequests.filter(
        req => req.userId.toString() !== userId
      );
      await organization.save();

      // Add to user's joinedOrganizations
      const user = await User.findById(userId);
      if (!user.joinedOrganizations.includes(id)) {
        user.joinedOrganizations.push(id);
        await user.save();
      }
    }

    res.json({
      success: true,
      message: `Join request ${status.toLowerCase()} successfully`,
      data: { joinRequest }
    });

  } catch (error) {
    console.error('Handle join request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      details: error.message
    });
  }
};

// @desc    Get organization's members
// @route   GET /api/organizations/:id/members
// @access  Private (Organization Admin only)
export const getOrganizationMembers = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('members', 'name email college year')
      .populate('adminUserId', 'name email');

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    // Check if user is organization admin or member
    const isAdmin = organization.adminUserId._id.toString() === req.user._id.toString();
    const isMember = organization.members.some(member => 
      member._id.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { 
        members: organization.members,
        admin: organization.adminUserId
      }
    });

  } catch (error) {
    console.error('Get organization members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      details: error.message
    });
  }
};

// @desc    Get user's organizations
// @route   GET /api/organizations/user/my-organizations
// @access  Private
export const getUserOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({
      members: req.user._id
    }).populate('adminUserId', 'name email');

    res.json({
      success: true,
      data: { organizations }
    });

  } catch (error) {
    console.error('Get user organizations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      details: error.message
    });
  }
};

// @desc    Get user's join requests
// @route   GET /api/organizations/user/join-requests
// @access  Private
export const getUserJoinRequests = async (req, res) => {
  try {
    const joinRequests = await JoinRequest.find({ userId: req.user._id })
      .populate('organizationId', 'name description');

    res.json({
      success: true,
      data: { joinRequests }
    });

  } catch (error) {
    console.error('Get user join requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      details: error.message
    });
  }
};
