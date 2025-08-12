import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

// Define the schema
const ViewSchema = new mongoose.Schema(
  {
    skillId: String,
    skillTitle: String,
    viewedBy: String,
    viewedAt: { type: Date, default: Date.now },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Register the model
const LearnableView =
  mongoose.models.LearnableView || mongoose.model('LearnableView', ViewSchema);

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { regNumber, seen } = req.query;

    if (!regNumber) {
      return res.status(400).json({ error: 'Missing regNumber' });
    }

    // Build the query dynamically
    const filter = { viewedBy: regNumber };
    if (seen === 'true') filter.seen = true;
    if (seen === 'false') filter.seen = false;

    // Fetch the views
    const views = await LearnableView.find(filter).sort({ viewedAt: -1 });

    return res.status(200).json({ views });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch views' });
  }
}