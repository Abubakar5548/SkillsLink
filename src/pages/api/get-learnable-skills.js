import dbConnect from '@/lib/dbConnect';
import LearnableSkill from '@/models/LearnableSkill';

export default async function handler(req, res) {
  await dbConnect();
  try {
    const skills = await LearnableSkill.find().sort({ createdAt: -1 });
    res.status(200).json({ skills });
  } catch (err) {
    console.error('Error fetching all skills:', err);
    res.status(500).json({ error: 'Server error' });
  }
}