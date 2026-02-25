import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'Email not found' });
  }

  return res.status(200).json({ message: 'Email verified. Continue to reset.' });
}