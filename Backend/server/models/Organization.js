import mongoose from 'mongoose';


const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  adminUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  logo: {
    type: String,
    default: null
  },
  website: {
    type: String
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  type: {
    type: String,
    enum: ['university', 'school', 'club', 'company', 'department'],
    required: true
  },
  category: {
    type: String,
    enum: ['academic', 'technical', 'cultural', 'sports', 'professional', 'social'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  contactPerson: {
    name: String,
    email: String,
    phone: String,
    position: String
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  pendingRequests: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  verificationDate: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  settings: {
    allowPublicRegistration: {
      type: Boolean,
      default: false
    },
    requireDocumentation: {
      type: Boolean,
      default: true
    },
    autoApproveMembers: {
      type: Boolean,
      default: false
    }
  },
  stats: {
    totalEvents: {
      type: Number,
      default: 0
    },
    totalMembers: {
      type: Number,
      default: 0
    },
    totalParticipations: {
      type: Number,
      default: 0
    }
  }

}, {
  timestamps: true
});

// Add createdAt field explicitly
organizationSchema.add({
  createdAt: {
    type: Date,
    default: Date.now
  }
});


// Update stats before saving
organizationSchema.pre('save', function(next) {
  if (this.isModified('members')) {
    this.stats.totalMembers = this.members.length;
  }
  next();
});

export default mongoose.model('Organization', organizationSchema);
