import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'organizer', 'admin'],
    default: 'student'
  },
  college: {
    type: String,
    required: function() {
      return this.role === 'student';
    }
  },
  year: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Alumni', 'Other'],
    required: function() {
      return this.role === 'student';
    }
  },
  educationLevel: {
    type: String,
    required: function() {
      return this.role === 'student';
    }
  },
  // Organization-specific fields
  organizationName: {
    type: String,
    required: function() {
      return this.role === 'organizer';
    }
  },
  organizationType: {
    type: String,
    enum: ['university', 'college', 'school', 'club'],
    required: function() {
      return this.role === 'organizer';
    }
  },
  organizationDescription: {
    type: String,
    required: function() {
      return this.role === 'organizer';
    }
  },
  officialEmailDomain: {
    type: String,
    required: function() {
      return this.role === 'organizer';
    }
  },
  profileImage: {
    type: String,
    default: null
  },
  resume: {
    fileName: String,
    filePath: String,
    uploadDate: Date
  },
  skills: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  bio: {
    type: String,
    maxlength: 500
  },
  phone: {
    type: String
  },
  linkedin: {
    type: String
  },
  github: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  organizationRequests: [{
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    requestDate: {
      type: Date,
      default: Date.now
    },
    documents: [{
      fileName: String,
      filePath: String,
      uploadDate: Date
    }]
  }],
  registeredEvents: [{
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event'
    },
    registrationDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'cancelled'],
      default: 'registered'
    }
  }],
  notifications: [{
    title: String,
    message: String,
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error']
    },
    read: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model('User', userSchema);
