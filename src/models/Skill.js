import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  title: String,
  description: String,
  likesCount: {
    type: Number,
    default: 0
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ GOOD: Check if model already exists before registering
export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);