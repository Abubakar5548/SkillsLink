import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  regNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);