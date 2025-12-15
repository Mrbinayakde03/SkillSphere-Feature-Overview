import Organization from '../models/Organization.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

// @desc    Create organization
// @route   POST /api/organizations
// @access  Private (Organizer/Admin)
export const createOrganization = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      name,
      description,
      website,
      email,
      type,
      category,
      address,
      contactPerson
    } = req.body;

    // Check if organization name already exists
    const existingOrg = await Organization.findOne({ name });
    if (existingOrg) {
      return res.status(400).json({
        success: false,
        message: 'Organization with this name already exists'
      });
    }

    // Create organization
    const organization = await Organization.create({
      name,
      description,
      website,
      email,
      type,
      category,
      address,
      contactPerson,
      admin: req.user._id,
      members: [{
        user: req.user._id,
        role: 'admin',
        joinedDate: new Date()
      }]
    });

    // Add admin to members array
    const adminUser = await User.findById(req.user._id);
    if (adminUser && adminUser.role === 'student') {
      adminUser.role = 'organizer';
      await adminUser.save();
    }

    res.status(201).json({
      success: true,
      message: 'Organization created successfully',
      data: { organization }
    });

  } catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all organizations
// @route   GET /api/organizations
// @access  Public
export const getOrganizations = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      type, 
      category, 
      search, 
      verified,
      sort = '-createdAt' 
    } = req.query;
    
    const query = { isActive: true };
    
    if (type) query.type = type;
    if (category) query.category = category;
    if (verified !== undefined) query.isVerified = verified === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const organizations = await Organization.find(query)
      .populate('admin', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Organization.countDocuments(query);

    res.json({
      success: true,
      data: {
        organizations,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get organizations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get organization by ID
// @route   GET /api/organizations/:id
// @access  Public
export const getOrganizationById = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('members.user', 'name email profileImage')
      .populate('verifiedBy', 'name');

    if (!organization || !organization.isActive) {
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
      message: 'Server error'
    });
  }
};

// @desc    Update organization
// @route   PUT /api/organizations/:id
// @access  Private (Organization admin)
export const updateOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    // Check if user is admin of this organization
    const isAdmin = organization.admin.toString() === req.user._id.toString() ||
                   organization.members.some(member => 
                     member.user.toString() === req.user._id.toString() && member.role === 'admin'
                   );

    if (!isAdmin && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this organization'
      });
    }

    const {
      name,
      description,
      website,
      email,
      type,
      category,
      address,
      contactPerson,
      settings
    } = req.body;

    // Update fields
    if (name) organization.name = name;
    if (description) organization.description = description;
    if (website) organization.website = website;
    if (email) organization.email = email;
    if (type) organization.type = type;
    if (category) organization.category = category;
    if (address) organization.address = address;
    if (contactPerson) organization.contactPerson = contactPerson;
    if (settings) organization.settings = { ...organization.settings, ...settings };

    await organization.save();

    res.json({
      success: true,
      message: 'Organization updated successfully',
      data: { organization }
    });

  } catch (error) {
    console.error('Update organization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete organization
// @route   DELETE /api/organizations/:id
// @access  Private (Admin only)
export const deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    // Soft delete
    organization.isActive = false;
    await organization.save();

    res.json({
      success: true,
      message: 'Organization deactivated successfully'
    });

  } catch (error) {
    console.error('Delete organization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Request to join organization
// @route   POST /api/organizations/:id/join
// @access  Private (Student)
export const requestToJoin = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    // Check if already a member
    const existingMember = organization.members.find(
      member => member.user.toString() === req.user._id.toString()
    );

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Already a member of this organization'
      });
    }

    // Check if already requested
    const existingRequest = organization.pendingRequests.find(
      request => request.user.toString() === req.user._id.toString() && request.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Join request already pending'
      });
    }

    // Add request
    organization.pendingRequests.push({
      user: req.user._id,
      requestDate: new Date(),
      status: 'pending'
    });

    await organization.save();

    // Also add to user's organizationRequests
    const user = await User.findById(req.user._id);
    user.organizationRequests.push({
      organizationId: organization._id,
      status: 'pending',
      requestDate: new Date()
    });
    await user.save();

    res.json({
      success: true,
      message: 'Join request submitted successfully'
    });

  } catch (error) {
    console.error('Request to join error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};


// @desc    Approve/Reject member request
// @route   PUT /api/organizations/:id/members/:userId
// @access  Private (Organization admin)
export const manageMemberRequest = async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const { userId } = req.params;

    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    // Check if user is admin
    const isAdmin = organization.admin.toString() === req.user._id.toString() ||
                   organization.members.some(member => 
                     member.user.toString() === req.user._id.toString() && member.role === 'admin'
                   );

    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage members'
      });
    }

    const requestIndex = organization.pendingRequests.findIndex(
      request => request.user.toString() === userId && request.status === 'pending'
    );

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Join request not found'
      });
    }

    if (action === 'approve') {
      // Move from pending to members
      const request = organization.pendingRequests[requestIndex];
      organization.members.push({
        user: request.user,
        role: 'member',
        joinedDate: new Date()
      });
      
      // Update user status
      const user = await User.findById(userId);
      const userRequestIndex = user.organizationRequests.findIndex(
        req => req.organizationId.toString() === organization._id.toString()
      );
      
      if (userRequestIndex !== -1) {
        user.organizationRequests[userRequestIndex].status = 'approved';
        await user.save();
      }

    } else if (action === 'reject') {
      // Update user status
      const user = await User.findById(userId);
      const userRequestIndex = user.organizationRequests.findIndex(
        req => req.organizationId.toString() === organization._id.toString()
      );
      
      if (userRequestIndex !== -1) {
        user.organizationRequests[userRequestIndex].status = 'rejected';
        await user.save();
      }
    }

    // Remove from pending requests
    organization.pendingRequests.splice(requestIndex, 1);
    await organization.save();

    res.json({
      success: true,
      message: `Member request ${action}d successfully`
    });

  } catch (error) {
    console.error('Manage member request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Verify organization (Admin only)
// @route   PUT /api/organizations/:id/verify
// @access  Private/Admin
export const verifyOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    organization.isVerified = true;
    organization.verificationDate = new Date();
    organization.verifiedBy = req.user._id;

    await organization.save();

    res.json({
      success: true,
      message: 'Organization verified successfully',
      data: { organization }
    });

  } catch (error) {
    console.error('Verify organization error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get organization analytics
// @route   GET /api/organizations/:id/analytics
// @access  Private (Organization admin)
export const getOrganizationAnalytics = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    // Check authorization
    const isAdmin = organization.admin.toString() === req.user._id.toString() ||
                   organization.members.some(member => 
                     member.user.toString() === req.user._id.toString() && member.role === 'admin'
                   );

    if (!isAdmin && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics'
      });
    }

    // Get analytics data (would need to implement with actual event data)
    const analytics = {
      totalMembers: organization.stats.totalMembers,
      totalEvents: organization.stats.totalEvents,
      totalParticipations: organization.stats.totalParticipations,
      pendingRequests: organization.pendingRequests.length,
      memberGrowth: [], // Would calculate from member join dates
      eventParticipation: [] // Would calculate from events
    };

    res.json({
      success: true,
      data: { analytics }
    });

  } catch (error) {
    console.error('Get organization analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
