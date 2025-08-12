import dbConnect from '@/lib/dbConnect';
import LearnableSkill from '@/models/LearnableSkill';

export default async function handler(req, res) {
  await dbConnect();

  const { regNumber } = req.query;

  if (!regNumber) {
    return res.status(400).json({ error: 'Missing reg number' });
  }

  try {
    const skills = await LearnableSkill.find({ postedBy: regNumber }).sort({ createdAt: -1 }).lean();
    res.status(200).json({ skills });
  } catch (error) {
    console.error('Error fetching my learnable skills:', error);
    res.status(500).json({ error: 'Server error' });
  }
}