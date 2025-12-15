import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['Workshop', 'Hackathon', 'Seminar', 'Competition', 'Career Fair', 'Networking', 'Conference'],
    required: true
  },
  type: {
    type: String,
    enum: ['inter', 'intra'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  endTime: {
    type: String
  },
  location: {
    type: String,
    required: true
  },
  venue: {
    name: String,
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  organizer: {
    name: {
      type: String,
      required: true
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization'
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    college: {
      type: String,
      required: true
    }
  },
  eligibility: {
    years: [{
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Alumni', 'All Years']
    }],
    skills: [{
      type: String
    }],
    departments: [String],
    cgpa: {
      min: Number,
      max: Number
    }
  },
  skills: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  maxParticipants: {
    type: Number,
    required: true,
    min: 1
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  registrationDeadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'organization'],
    default: 'public'
  },
  registrationRequired: {
    type: Boolean,
    default: true
  },
  registrationFee: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paymentMethod: {
      type: String,
      enum: ['free', 'online', 'offline'],
      default: 'free'
    }
  },
  requirements: {
    resume: {
      type: Boolean,
      default: false
    },
    portfolio: {
      type: Boolean,
      default: false
    },
    documentation: [{
      type: String,
      description: String
    }]
  },
  agenda: [{
    time: String,
    title: String,
    description: String,
    speaker: String
  }],
  speakers: [{
    name: String,
    bio: String,
    image: String,
    linkedin: String,
    twitter: String
  }],
  sponsors: [{
    name: String,
    logo: String,
    website: String
  }],
  media: {
    images: [{
      url: String,
      caption: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }],
    videos: [{
      url: String,
      title: String,
      uploadedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  certificates: {
    enabled: {
      type: Boolean,
      default: false
    },
    template: String,
    issuedCount: {
      type: Number,
      default: 0
    }
  },
  analytics: {
    views: {
      type: Number,
      default: 0
    },
    registrations: {
      type: Number,
      default: 0
    },
    cancellations: {
      type: Number,
      default: 0
    },
    attendance: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    }
  },
  settings: {
    allowWaitlist: {
      type: Boolean,
      default: true
    },
    autoApprove: {
      type: Boolean,
      default: false
    },
    sendReminders: {
      type: Boolean,
      default: true
    },
    allowCancellation: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Update analytics before saving
eventSchema.pre('save', function(next) {
  this.analytics.registrations = this.currentParticipants;
  if (this.maxParticipants > 0) {
    this.analytics.completionRate = (this.analytics.registrations / this.maxParticipants) * 100;
  }
  next();
});

// Index for better query performance
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ type: 1, status: 1 });
eventSchema.index({ 'organizer.user': 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ skills: 1 });

export default mongoose.model('Event', eventSchema);
