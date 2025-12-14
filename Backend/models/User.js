import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'organizer'], default: 'user' },

  // User-specific fields
  skills: [{ type: String }],
  educationLevel: { type: String },
  resume: { type: String }, // File path

  interests: [{ type: String }],

  // Organizer-specific fields
  organizationName: { type: String },
  organizationType: { type: String },
  organizationDescription: { type: String },
  organizationLogo: { type: String }, // File path
  officialEmailDomain: { type: String },
},
{
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model('User', userSchema);
