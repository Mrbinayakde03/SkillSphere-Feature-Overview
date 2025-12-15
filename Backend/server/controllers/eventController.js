import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import Organization from '../models/Organization.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';


// @desc    Create event
// @route   POST /api/events
// @access  Private (ORGANIZATION role)
export const createEvent = async (req, res) => {
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
      title, 
      description, 
      category, 
      type, 
      date, 
      time, 
      location,
      organizationId 
    } = req.body;

    // Check if user is ORGANIZATION role
    if (req.user.role !== 'ORGANIZATION') {
      return res.status(403).json({
        success: false,
        message: 'Only organizations can create events'
      });
    }

    // Verify the organization belongs to this user
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    if (organization.adminUserId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only organization admin can create events'
      });
    }

    const event = await Event.create({
      title,
      description,
      category,
      type,
      date,
      time,
      location,
      organizationId,
      organizer: {
        name: req.user.name,
        user: req.user._id,
        college: req.user.organizationName || 'Organization'
      }
    });

    // Update organization stats
    await Organization.findByIdAndUpdate(
      organizationId,
      { $inc: { 'stats.totalEvents': 1 } }
    );

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      details: error.message
    });

  }
};

// @desc    Get INTER events (public)
// @route   GET /api/events/inter
// @access  Public
export const getInterEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      upcoming = 'true',
      sort = '-createdAt'
    } = req.query;

    const query = { 
      type: 'INTER',
      status: 'upcoming' 
    };
    
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Show upcoming events by default
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('organizationId', 'name logo')
      .populate('organizer.user', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get INTER events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      details: error.message
    });
  }
};

// @desc    Get INTRA events (authorized users only)
// @route   GET /api/events/intra
// @access  Private (Users who are members of organizations)
export const getIntraEvents = async (req, res) => {
  try {
    // Check if user is USER role and has joined organizations
    if (req.user.role !== 'USER') {
      return res.status(403).json({
        success: false,
        message: 'Only users can access intra events'
      });
    }

    const user = await User.findById(req.user._id).populate('joinedOrganizations');
    
    if (!user.joinedOrganizations || user.joinedOrganizations.length === 0) {
      return res.json({
        success: true,
        data: {
          events: [],
          pagination: {
            current: 1,
            pages: 0,
            total: 0
          }
        }
      });
    }

    const {
      page = 1,
      limit = 12,
      category,
      search,
      upcoming = 'true',
      sort = '-createdAt'
    } = req.query;

    const organizationIds = user.joinedOrganizations.map(org => org._id);

    const query = { 
      type: 'INTRA',
      organizationId: { $in: organizationIds },
      status: 'upcoming'
    };
    
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Show upcoming events by default
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('organizationId', 'name logo')
      .populate('organizer.user', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(query);

    res.json({
      success: true,
      data: {
        events,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get INTRA events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      details: error.message
    });
  }
};




// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer.user', 'name email profileImage')
      .populate('organizer.organization', 'name logo description')
      .populate('feedback.user', 'name profileImage');

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check visibility permissions
    if (event.type === 'intra') {
      if (!req.user) {
        return res.status(403).json({
          success: false,
          message: 'This event requires authentication'
        });
      }

      const isMember = await Organization.findOne({
        _id: event.organizer.organization,
        'members.user': req.user._id
      });

      if (!isMember && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view this event'
        });
      }
    }

    // Increment view count
    event.analytics.views += 1;
    await event.save();

    res.json({
      success: true,
      data: { event }
    });

  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Event organizer)
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is organizer
    const isOrganizer = event.organizer.user.toString() === req.user._id.toString() ||
                       req.user.role === 'admin';

    if (!isOrganizer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    // Don't allow changes after event has started
    if (event.status === 'ongoing' || event.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update event after it has started'
      });
    }

    // Update fields
    const allowedUpdates = [
      'title', 'description', 'category', 'date', 'time', 'endTime', 'location',
      'eligibility', 'skills', 'tags', 'maxParticipants', 'registrationDeadline',
      'visibility', 'agenda', 'speakers', 'sponsors', 'media', 'settings'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event }
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Event organizer)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is organizer
    const isOrganizer = event.organizer.user.toString() === req.user._id.toString() ||
                       req.user.role === 'admin';

    if (!isOrganizer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    // Soft delete
    event.isActive = false;
    await event.save();

    // Cancel all registrations
    await Registration.updateMany(
      { event: event._id },
      { status: 'cancelled' }
    );

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private (Student)
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if event is open for registration
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed'
      });
    }

    // Check if event is full
    if (event.currentParticipants >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Event is full'
      });
    }

    // Check if user is already registered
    const existingRegistration = await Registration.findOne({
      user: req.user._id,
      event: event._id
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Already registered for this event'
      });
    }

    // Create registration
    const registration = await Registration.create({
      user: req.user._id,
      event: event._id,
      status: event.settings.autoApprove ? 'registered' : 'pending'
    });

    // Update event participant count
    event.currentParticipants += 1;
    await event.save();

    // Add to user's registered events
    const user = await User.findById(req.user._id);
    user.registeredEvents.push({
      eventId: event._id,
      registrationDate: new Date(),
      status: registration.status
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: `Registration ${registration.status === 'registered' ? 'successful' : 'pending approval'}`,
      data: { registration }
    });

  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Cancel event registration
// @route   DELETE /api/events/:id/register
// @access  Private
export const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findOne({
      user: req.user._id,
      event: req.params.id
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Check if cancellation is allowed
    const event = await Event.findById(req.params.id);
    if (!event.settings.allowCancellation) {
      return res.status(400).json({
        success: false,
        message: 'Cancellation not allowed for this event'
      });
    }

    // Update registration status
    registration.status = 'cancelled';
    await registration.save();

    // Update event participant count
    event.currentParticipants = Math.max(0, event.currentParticipants - 1);
    await event.save();

    // Remove from user's registered events
    const user = await User.findById(req.user._id);
    const eventIndex = user.registeredEvents.findIndex(
      reg => reg.eventId.toString() === req.params.id
    );
    
    if (eventIndex !== -1) {
      user.registeredEvents[eventIndex].status = 'cancelled';
      await user.save();
    }

    res.json({
      success: true,
      message: 'Registration cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get event registrations (Organizer only)
// @route   GET /api/events/:id/registrations
// @access  Private (Event organizer)
export const getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is organizer
    const isOrganizer = event.organizer.user.toString() === req.user._id.toString() ||
                       req.user.role === 'admin';

    if (!isOrganizer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view registrations'
      });
    }

    const registrations = await Registration.find({ event: event._id })
      .populate('user', 'name email college year profileImage')
      .sort('-registrationDate');

    res.json({
      success: true,
      data: { registrations }
    });

  } catch (error) {
    console.error('Get event registrations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Approve/Reject registration
// @route   PUT /api/events/:id/registrations/:registrationId
// @access  Private (Event organizer)
export const manageRegistration = async (req, res) => {
  try {
    const { status } = req.body; // 'approved', 'rejected', 'waitlisted'
    const { registrationId } = req.params;

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is organizer
    const isOrganizer = event.organizer.user.toString() === req.user._id.toString() ||
                       req.user.role === 'admin';

    if (!isOrganizer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to manage registrations'
      });
    }

    const registration = await Registration.findById(registrationId)
      .populate('user', 'name email');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    // Update registration status
    registration.status = status;
    registration.approvalDate = new Date();
    registration.approvedBy = req.user._id;
    await registration.save();

    // Update user registered events status
    const user = await User.findById(registration.user._id);
    const eventIndex = user.registeredEvents.findIndex(
      reg => reg.eventId.toString() === event._id.toString()
    );
    
    if (eventIndex !== -1) {
      user.registeredEvents[eventIndex].status = status;
      await user.save();
    }

    res.json({
      success: true,
      message: `Registration ${status} successfully`,
      data: { registration }
    });

  } catch (error) {
    console.error('Manage registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's registered events
// @route   GET /api/users/events
// @access  Private
export const getUserEvents = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate({
        path: 'event',
        populate: {
          path: 'organizer.organization',
          select: 'name logo'
        }
      })
      .sort('-registrationDate');

    res.json({
      success: true,
      data: { registrations }
    });

  } catch (error) {
    console.error('Get user events error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get event analytics
// @route   GET /api/events/:id/analytics
// @access  Private (Event organizer)
export const getEventAnalytics = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if user is organizer
    const isOrganizer = event.organizer.user.toString() === req.user._id.toString() ||
                       req.user.role === 'admin';

    if (!isOrganizer) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view analytics'
      });
    }

    const registrations = await Registration.find({ event: event._id });

    const analytics = {
      ...event.analytics,
      totalRegistrations: registrations.length,
      statusBreakdown: {
        pending: registrations.filter(r => r.status === 'pending').length,
        approved: registrations.filter(r => r.status === 'approved').length,
        rejected: registrations.filter(r => r.status === 'rejected').length,
        attended: registrations.filter(r => r.attendance.checked).length
      },
      dailyRegistrations: [] // Would calculate from registration dates
    };

    res.json({
      success: true,
      data: { analytics }
    });

  } catch (error) {
    console.error('Get event analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
