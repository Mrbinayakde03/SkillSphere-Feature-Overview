import mongoose from 'mongoose';

const joinRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
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
});

// Compound index to ensure one request per user per organization
joinRequestSchema.index({ userId: 1, organizationId: 1 }, { unique: true });

export default mongoose.model('JoinRequest', joinRequestSchema);
