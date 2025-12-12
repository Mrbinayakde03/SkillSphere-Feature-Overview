import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'registered', 'attended', 'cancelled', 'waitlisted'],
    default: 'pending'
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: Date,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  documents: [{
    fileName: String,
    filePath: String,
    fileType: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  notes: String,
  attendance: {
    checked: {
      type: Boolean,
      default: false
    },
    checkInTime: Date,
    checkOutTime: Date
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date
  },
  certificate: {
    issued: {
      type: Boolean,
      default: false
    },
    issuedAt: Date,
    certificateUrl: String,
    verificationCode: String
  },
  payment: {
    amount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    method: {
      type: String,
      enum: ['free', 'card', 'bank_transfer', 'upi', 'cash'],
      default: 'free'
    },
    transactionId: String,
    paymentDate: Date
  },
  notifications: {
    welcome: {
      type: Boolean,
      default: false
    },
    reminder: {
      type: Boolean,
      default: false
    },
    certificate: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Compound index to ensure unique registration per user per event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });
registrationSchema.index({ status: 1 });
registrationSchema.index({ registrationDate: 1 });
registrationSchema.index({ event: 1, status: 1 });

export default mongoose.model('Registration', registrationSchema);
