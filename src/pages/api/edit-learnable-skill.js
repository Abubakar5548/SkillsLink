import dbConnect from '@/lib/dbConnect';
import LearnableSkill from '@/models/LearnableSkill';

export default async function handler(req, res) {
  await dbConnect();

  const { id } = req.query;

  if (!id) return res.status(400).json({ error: 'Missing skill ID' });

  if (req.method === 'GET') {
    try {
      const skill = await LearnableSkill.findById(id);
      if (!skill) return res.status(404).json({ error: 'Skill not found' });
      return res.status(200).json({ skill });
    } catch (err) {
      return res.status(500).json({ error: 'Server error' });
    }
  }

  if (req.method === 'PUT') {
    const { title, description, link, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    try {
      const updated = await LearnableSkill.findByIdAndUpdate(
        id,
        { title, description, link, category },
        { new: true }
      );
      return res.status(200).json({ success: true, updated });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to update skill' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}