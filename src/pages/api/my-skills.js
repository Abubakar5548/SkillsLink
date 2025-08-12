import dbConnect from '../../lib/dbConnect';
import Skill from '../../models/Skill';

export default async function handler(req, res) {
  await dbConnect();

  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      const skills = await Skill.find({ userId }).sort({ createdAt: -1 });
      res.status(200).json({ skills });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch skills' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}