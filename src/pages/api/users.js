import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const users = await User.find({}, '-password'); // exclude password
    return res.status(200).json({ users });
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}