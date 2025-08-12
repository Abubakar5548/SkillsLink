import dbConnect from '../../lib/dbConnect';
import LearnableSkill from '../../models/LearnableSkill';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const skills = await LearnableSkill.find({}).sort({ createdAt: -1 });
    res.status(200).json({ skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
}