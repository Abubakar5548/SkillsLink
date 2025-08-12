import dbConnect from '@/lib/dbConnect';
import LearnableSkill from '@/models/LearnableSkill';

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      await LearnableSkill.findByIdAndDelete(id);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete skill' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}